import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { usePositivityStore } from '../store/positivityStore';
import { RULES, getRuleById } from '../data/rules';
import { useRouter } from 'expo-router';
import { Lightbulb, X, Play } from 'lucide-react-native';

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
    // Count rule usage frequency
    const usageCount = new Map<string, number>();
    rulesUsed.forEach((ruleId) => {
      usageCount.set(ruleId, (usageCount.get(ruleId) || 0) + 1);
    });

    // Get all rules that haven't been used much
    const candidates: RecommendedRule[] = [];

    RULES.forEach((rule) => {
      if (dismissedRecs.includes(rule.id)) {
        return; // Skip dismissed recommendations
      }

      const timesSeen = usageCount.get(rule.id) || 0;
      let score = 0;
      let reason = '';

      if (timesSeen === 0) {
        // New rule - suggest based on category diversity
        const usedCategories = new Set(
          Array.from(usageCount.keys())
            .map((id) => getRuleById(id)?.categoryId)
            .filter(Boolean)
        );

        if (!usedCategories.has(rule.categoryId)) {
          score = 85;
          reason = `Try a new ${rule.categoryId} technique`;
        } else {
          score = 60;
          reason = `Explore more in ${rule.categoryId}`;
        }
      } else if (timesSeen === 1) {
        // Used once - recommend similar ones
        score = 50;
        reason = 'You might like this too';
      } else {
        // Used multiple times - suggest variation
        score = 40;
        reason = 'Mix it up with this approach';
      }

      if (score > 0) {
        candidates.push({ ruleId: rule.id, reason, score });
      }
    });

    // Sort by score and return top 3
    return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [rulesUsed, dismissedRecs]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: t.border }]}>
        <Lightbulb size={16} color={t.positivity} strokeWidth={2} />
        <Text style={[styles.headerText, { color: t.ink }]}>Recommended for You</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {recommendations.map((rec) => {
          const rule = getRuleById(rec.ruleId);
          if (!rule) return null;

          return (
            <View
              key={rec.ruleId}
              style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.ruleCategory, { color: t.positivity }]}>
                  {rule.categoryId.toUpperCase()}
                </Text>
                <Pressable
                  onPress={() => dismissRecommendation(rule.id)}
                  hitSlop={8}
                >
                  <X size={16} color={t.inkDim} strokeWidth={2} />
                </Pressable>
              </View>

              <Text style={[styles.ruleName, { color: t.ink }]} numberOfLines={2}>
                {rule.name}
              </Text>
              <Text style={[styles.reason, { color: t.inkMid }]} numberOfLines={1}>
                {rec.reason}
              </Text>

              <Pressable
                onPress={() => router.push(`/rule/${rule.id}`)}
                style={[styles.startBtn, { backgroundColor: t.positivity }]}
              >
                <Play size={14} color="#FFF" strokeWidth={2.5} fill="#FFF" />
                <Text style={styles.startBtnText}>Start</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingRight: 16,
    gap: 10,
  },
  card: {
    width: 150,
    padding: 12,
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleCategory: {
    fontSize: 10,
    fontFamily: 'JetBrainsMono_500Medium',
  },
  ruleName: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  reason: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  startBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#FFF',
  },
});
