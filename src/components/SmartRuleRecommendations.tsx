import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { usePositivityStore } from '../store/positivityStore';
import { RULES, getRuleById } from '../data/rules';
import { useRouter } from 'expo-router';
import { Lightbulb, X, ArrowRight } from 'lucide-react-native';
import { ThemedText } from './ThemedText';

interface RecommendedRule {
  ruleId: string;
  reason: string;
  score: number;
}

export function SmartRuleRecommendations() {
  const t = useTheme();
  const router = useRouter();
  const rulesUsed = usePositivityStore((s) => s.rulesUsed);
  const dismissedRecs = usePositivityStore((s) => s.dismissedRecommendations || []);
  const dismissRecommendation = usePositivityStore((s) => s.dismissRecommendation);

  // Generate recommendations based on usage patterns
  const recommendations: RecommendedRule[] = useMemo(() => {
    const usageCount = new Map<string, number>();
    rulesUsed.forEach((ruleId) => {
      usageCount.set(ruleId, (usageCount.get(ruleId) || 0) + 1);
    });

    const candidates: RecommendedRule[] = [];
    RULES.forEach((rule) => {
      if (dismissedRecs.includes(rule.id)) return;

      const timesSeen = usageCount.get(rule.id) || 0;
      let score = 0;
      let reason = '';

      if (timesSeen === 0) {
        score = 85;
        reason = `New ${rule.categoryId} ritual`;
      } else if (timesSeen === 1) {
        score = 50;
        reason = 'Perfect for your flow';
      }

      if (score > 0) {
        candidates.push({ ruleId: rule.id, reason, score });
      }
    });

    return candidates.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [rulesUsed, dismissedRecs]);

  if (recommendations.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Lightbulb size={16} color={t.positivity} strokeWidth={2.5} />
        <ThemedText variant="h3" style={{ marginLeft: 8, fontSize: 16 }}>
          Recommended
        </ThemedText>
      </View>

      {/* Horizontal Scroll with Bleed Effect */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Negate the parent padding (24) to bleed to screen edges
        style={styles.bleedScroll}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={250 + 12} // Matches card width + gap exactly
      >
        {recommendations.map((rec) => {
          const rule = getRuleById(rec.ruleId);
          if (!rule) return null;

          return (
            <Pressable
              key={rec.ruleId}
              onPress={() => router.push(`/rule/${rule.id}` as any)}
              style={[styles.card, { backgroundColor: t.isDark ? '#0d0d0d' : t.surfaceContainer, borderColor: t.border }]}
            >
              <View style={styles.cardHeader}>
                <ThemedText variant="mono" color={t.positivity} style={{ fontSize: 10 }}>
                  {rule.categoryId.toUpperCase()}
                </ThemedText>
                <Pressable onPress={() => dismissRecommendation(rule.id)} hitSlop={12}>
                  <X size={14} color={t.textDisabled} />
                </Pressable>
              </View>

              <View style={styles.cardBody}>
                <View>
                  <ThemedText variant="h3" style={{ fontSize: 16 }} numberOfLines={1}>
                    {rule.name}
                  </ThemedText>
                  <ThemedText variant="caption" color={t.textSecondary} style={{ marginTop: 2 }} numberOfLines={2}>
                    {rec.reason}
                  </ThemedText>
                </View>
                
                <View style={[styles.startPill, { backgroundColor: t.positivity }]}>
                  <ThemedText variant="label" style={{ color: '#000', fontWeight: '900', fontSize: 10 }}>START</ThemedText>
                  <ArrowRight size={14} color="#000" strokeWidth={3} style={{ marginLeft: 6 }} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bleedScroll: {
    marginHorizontal: -tokens.spacing.padding, // Negate parent padding
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.padding, // Restore padding internally for first/last items
    gap: 12,
  },
  card: {
    width: 250, 
    height: 155, // Tightened from 165
    padding: 16,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between', // Push pill to bottom
    marginTop: 8,
  },
  startPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    borderRadius: tokens.radius.full,
    paddingHorizontal: 12,
    alignSelf: 'flex-end', // Float to right
  },
});
