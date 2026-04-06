import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ThemedText';
import { BentoCard } from './BentoCard';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface SessionReflectionProps {
  visible: boolean;
  onClose: (score: number) => void;
  ruleName: string;
}

export function SessionReflection({ visible, onClose, ruleName }: SessionReflectionProps) {
  const t = useTheme();
  const [score, setScore] = useState(0);

  const handleFinish = () => {
    if (score > 0) {
      onClose(score);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.positivity} style={{ letterSpacing: 2, marginBottom: 8 }}>SESSION COMPLETE</ThemedText>
          <ThemedText variant="h2" align="center">{ruleName}</ThemedText>
          
          <View style={{ marginVertical: 32, alignItems: 'center' }}>
            <ThemedText variant="body" color={t.textSecondary} align="center" style={{ marginBottom: 20 }}>
              How focused were you?
            </ThemedText>
            
            <View style={styles.scoreRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => {
                    setScore(s);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  style={[
                    styles.scoreBtn,
                    { 
                      backgroundColor: score === s ? t.positivity : t.surfaceLow,
                    }
                  ]}
                >
                  <ThemedText 
                    variant="h3" 
                    style={{ color: score === s ? '#FFF' : t.textSecondary }}
                  >
                    {s}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <BentoCard variant="default" style={{ backgroundColor: t.surfaceLow, padding: 16, marginBottom: 24 }}>
             <ThemedText variant="caption" color={t.textSecondary} style={{ fontStyle: 'italic' }}>
               &quot;You focus best in 25–40 min sessions based on your biological peak.&quot;
             </ThemedText>
          </BentoCard>

          <Pressable
            onPress={handleFinish}
            disabled={score === 0}
            style={[
              styles.finishBtn,
              { 
                backgroundColor: score > 0 ? t.positivity : t.surfaceHigh,
                opacity: score > 0 ? 1 : 0.5
              }
            ]}
          >
            <ThemedText variant="label" style={{ color: score > 0 ? '#FFF' : t.textDisabled, fontWeight: '900' }}>Save Insight</ThemedText>
            {score > 0 && <Check size={18} color="#FFF" strokeWidth={3} style={{ marginLeft: 8 }} />}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
