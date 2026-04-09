import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { AppModal } from '../components/AppModal';
import { 
  getFlashcardsByRule, 
  upsertFlashcard, 
  deleteFlashcard, 
  FlashCardRecord 
} from '../db/flashcardRepository';
import { notifyNow } from '../services/NotificationManager';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

/**
 * SpacedRepetitionEngine
 * Powers rules: Spaced Repetition System (SRS), 1-4-7 Day Rule
 * Uses flashcard-style review with spacing algorithm
 * v1.3.0: Persistent Storage & SRS Notifications
 */
export function SpacedRepetitionEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const [cards, setCards] = useState<FlashCardRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [mode, setMode] = useState<'create' | 'review'>('create');
  const [modal, setModal] = useState<{ visible: boolean; title: string; description: string } | null>(null);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    const stored = await getFlashcardsByRule(rule.id);
    setCards(stored);
    setIsLoading(false);
  }, [rule.id]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  const handleAddCard = async () => {
    if (!frontText.trim() || !backText.trim()) {
      setModal({
        visible: true,
        title: 'Incomplete Card',
        description: 'Please fill in both front and back.',
      });
      return;
    }

    const newCard: FlashCardRecord = {
      id: Date.now().toString(),
      rule_id: rule.id,
      front: frontText,
      back: backText,
      next_review: Date.now(),
      ease_factor: 2.5,
      interval: 1,
      repetitions: 0,
      created_at: new Date().toISOString(),
    };

    await upsertFlashcard(newCard);
    setCards([...cards, newCard]);
    setFrontText('');
    setBackText('');
  };

  const handleRemoveCard = async (cardId: string) => {
    await deleteFlashcard(cardId);
    setCards(cards.filter(c => c.id !== cardId));
  };

  const handleStartReview = () => {
    if (cards.length === 0) {
      setModal({
        visible: true,
        title: 'No Cards',
        description: 'Please create flashcards first.',
      });
      return;
    }
    setMode('review');
    session.startSession(rule.id);
    setCurrentCardIdx(0);
    setCardFlipped(false);
  };

  const handleCardResponse = async (quality: number) => {
    // SM-2 Algorithm
    const card = cards[currentCardIdx];
    let newEaseFactor = card.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor);

    let newInterval = card.interval;
    if (quality < 3) {
      newInterval = 1;
    } else {
      newInterval = card.repetitions === 0 ? 1 : card.repetitions === 1 ? 3 : Math.round(card.interval * newEaseFactor);
    }

    const nextReviewTimestamp = Date.now() + newInterval * 24 * 60 * 60 * 1000;

    const updatedCard: FlashCardRecord = {
      ...card,
      ease_factor: newEaseFactor,
      interval: newInterval,
      repetitions: card.repetitions + 1,
      next_review: nextReviewTimestamp,
    };

    await upsertFlashcard(updatedCard);
    
    // Auto-schedule SRS reminder for this rule
    notifyNow(
      'Review Due!',
      `You have a scheduled review for ${rule.name}.`,
      { type: 'srs_reminder', ruleId: rule.id }
    );

    const updatedCards = [...cards];
    updatedCards[currentCardIdx] = updatedCard;
    setCards(updatedCards);

    // Next card
    if (currentCardIdx < cards.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
      setCardFlipped(false);
    } else {
      // Review complete
      session.endSession();
      setMode('create');
      setModal({
        visible: true,
        title: 'Review Complete',
        description: `${cards.length} cards reviewed.`,
      });
    }
  };

  // CREATE MODE
  if (mode === 'create') {
    return (
      <>
        <View style={styles.createMode}>
          {/* Instruction */}
          <View style={styles.instrBox}>
            <Text style={[styles.instrTitle, { color: t.ink }]}>
              {rule.name}
            </Text>
            <Text style={[styles.instrDesc, { color: t.inkMid }]}>
              Create flashcards and review them at optimal intervals
            </Text>
          </View>

          {/* Card Creator */}
          <View style={styles.creatorBox}>
            <View style={[styles.inputBox, {
              backgroundColor: t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderColor: t.border
            }]}>
              <TextInput
                style={[styles.textInput, { color: t.ink }]}
                placeholder="Term or question..."
                placeholderTextColor={t.inkDim}
                value={frontText}
                onChangeText={setFrontText}
              />
            </View>

            <View style={[styles.inputBox, {
              backgroundColor: t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderColor: t.border
            }]}>
              <TextInput
                style={[styles.textInput, { color: t.ink, height: 60 }]}
                placeholder="Definition or answer..."
                placeholderTextColor={t.inkDim}
                value={backText}
                onChangeText={setBackText}
                multiline
              />
            </View>

            <Pressable
              onPress={handleAddCard}
              style={[styles.addCardBtn, { backgroundColor: color }]}
            >
              <Plus size={18} color="#FFF" />
              <Text style={styles.addCardText}>Add Card</Text>
            </Pressable>
          </View>

          {/* Card List */}
          <View style={styles.cardsList}>
              <Text style={[styles.cardsTitle, { color: t.ink }]}>
                {isLoading ? 'Loading...' : `${cards.length} card${cards.length !== 1 ? 's' : ''}`}
              </Text>
              {isLoading ? (
                <ActivityIndicator color={color} style={{ marginTop: 20 }} />
              ) : (
                <FlatList
                  data={cards}
                  keyExtractor={item => item.id}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  renderItem={({ item }) => (
                    <View style={[styles.cardPreview, {
                      backgroundColor: color + '10',
                      borderColor: color
                    }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.cardPreviewFront, { color: t.ink }]}>
                          Q: {item.front}
                        </Text>
                        <Text style={[styles.cardPreviewBack, { color: t.inkMid }]}>
                          A: {item.back}
                        </Text>
                      </View>
                      <Pressable onPress={() => handleRemoveCard(item.id)}>
                        <Trash2 size={16} color={t.inkMid} />
                      </Pressable>
                    </View>
                  )}
                  style={styles.flatList}
                />
              )}
          </View>

          {/* Start Review */}
          {!isLoading && cards.length > 0 && (
            <Pressable
              onPress={handleStartReview}
              style={[styles.reviewBtn, { backgroundColor: color }]}
            >
              <Text style={styles.reviewBtnText}>Start Review</Text>
              <ChevronRight size={18} color="#FFF" />
            </Pressable>
          )}
        </View>
        <AppModal
          visible={modal?.visible || false}
          title={modal?.title || ''}
          description={modal?.description || ''}
          onClose={() => setModal(null)}
        />
      </>
    );
  }

  // REVIEW MODE
  const currentCard = cards[currentCardIdx];
  if (!currentCard) return null;

  return (
    <>
      <View style={styles.reviewMode}>
        {/* Progress */}
        <Text style={[styles.reviewProgress, { color: t.inkMid }]}>
          Card {currentCardIdx + 1} / {cards.length}
        </Text>

        {/* Flashcard */}
        <Pressable
          onPress={() => setCardFlipped(!cardFlipped)}
          style={[styles.flashcard, {
            backgroundColor: cardFlipped ? color : t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            borderColor: color
          }]}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, {
              color: cardFlipped ? '#FFF' : t.inkMid
            }]}>
              {cardFlipped ? 'Answer' : 'Question'}
            </Text>
            <Text style={[styles.cardText, {
              color: cardFlipped ? '#FFF' : t.ink
            }]}>
              {cardFlipped ? currentCard.back : currentCard.front}
            </Text>
          </View>
          <Text style={[styles.tapText, { color: cardFlipped ? '#FFF' : t.inkDim }]}>
            Tap to {cardFlipped ? 'show question' : 'reveal'}
          </Text>
        </Pressable>

        {/* Quality Rating */}
        {cardFlipped && (
          <View style={styles.qualityRating}>
            <Text style={[styles.rateLabel, { color: t.ink }]}>How well did you know it?</Text>
            <View style={styles.ratingButtons}>
              <Pressable
                onPress={() => handleCardResponse(1)}
                style={[styles.ratingBtn, {
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  borderColor: '#EF4444'
                }]}
              >
                <Text style={[styles.ratingText, { color: '#EF4444' }]}>Hard</Text>
              </Pressable>
              <Pressable
                onPress={() => handleCardResponse(3)}
                style={[styles.ratingBtn, {
                  backgroundColor: 'rgba(251, 146, 60, 0.15)',
                  borderColor: '#FB923C'
                }]}
              >
                <Text style={[styles.ratingText, { color: '#FB923C' }]}>OK</Text>
              </Pressable>
              <Pressable
                onPress={() => handleCardResponse(5)}
                style={[styles.ratingBtn, {
                  backgroundColor: `${color}15`,
                  borderColor: color
                }]}
              >
                <Text style={[styles.ratingText, { color }]}>Easy</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
      <AppModal
        visible={modal?.visible || false}
        title={modal?.title || ''}
        description={modal?.description || ''}
        onClose={() => setModal(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  createMode: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  instrBox: {
    gap: 8,
  },
  instrTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Manrope_700Bold',
  },
  instrDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  creatorBox: {
    gap: 12,
  },
  inputBox: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addCardText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardsList: {
    gap: 10,
    flexGrow: 1,
    maxHeight: 300,
  },
  cardsTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  cardPreview: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  cardPreviewFront: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardPreviewBack: {
    fontSize: 12,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 12,
  },
  reviewBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  reviewMode: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    gap: 32,
  },
  reviewProgress: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  flashcard: {
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 280,
    gap: 12,
  },
  cardContent: {
    alignItems: 'center',
    gap: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  tapText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 16,
  },
  qualityRating: {
    gap: 12,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  }
});
