import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import { CATEGORIES } from '../../src/data/categories';
import { RULES, getRulesByCategory } from '../../src/data/rules';
import { ThemedText } from '../../src/components/ThemedText';
import { BentoCard } from '../../src/components/BentoCard';
import { SessionStatusBadge } from '../../src/components/SessionStatusBadge';
import { SmartRuleRecommendations } from '../../src/components/SmartRuleRecommendations';
import { Settings2, Play, Flame, Trophy, Star, Lightbulb, ChevronRight, LayoutGrid } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';

import { useSettingsStore } from '../../src/store/settingsStore';
import { usePositivityStore } from '../../src/store/positivityStore';
import { getDailyTip } from '../../src/utils/getDailyTip';

export default function Home() {
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  
  const userName = useSettingsStore((s) => s.userName);
  const weeklyStreak = usePositivityStore((s) => s.weeklyStreak);

  const weeklyScore = usePositivityStore((s) => s.weeklyScore);
  const remainingPoints = 500 - weeklyScore;

  // Helper to get rule count for a category
  const getRuleCount = (catId: any) => getRulesByCategory(catId).length;

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + tokens.spacing.md,
          paddingBottom: insets.bottom + 180, 
          paddingHorizontal: tokens.spacing.padding 
        }}
      >
        {/* Header: Greeting + Settings */}
        <View style={styles.header}>
          <View>
            <ThemedText variant="h2">Hello, {userName}</ThemedText>
            <View style={styles.streakRow}>
              <Flame size={16} color={t.focus} fill={t.focus} />
              <ThemedText variant="caption" color={t.textSecondary} style={{ marginLeft: 4 }}>
                {weeklyStreak} day streak
              </ThemedText>
            </View>
          </View>
          <Pressable 
            onPress={() => router.push('/settings' as any)}
            style={[styles.iconBtn, { backgroundColor: t.surfaceLow, borderColor: t.border }]}
          >
            <Settings2 size={20} color={t.text} />
          </Pressable>
        </View>

        {/* Active Session Badge (Pushed down if active) */}
        <SessionStatusBadge />

        {/* Primary CTA: Start Session (v5 Full-Width Hero) */}
        <BentoCard 
          variant="reward" 
          accent={t.positivity} 
          glow={true}
          onPress={() => router.push('/(tabs)/explore' as any)}
          style={[
            styles.heroCard, 
            !t.isDark && {
              backgroundColor: '#C5E1A5', // Deeper weighted green for stability
              borderWidth: 0, 
              shadowColor: t.positivity,
              shadowOpacity: 0.1,
              shadowRadius: 20,
            }
          ]}
        >
          <View style={styles.heroContentFull}>
            <ThemedText variant="h2" align="center" style={{ color: t.isDark ? '#fff' : t.text }}>Ready to thrive?</ThemedText>
            <ThemedText variant="body" align="center" style={{ color: t.isDark ? 'rgba(255,255,255,0.7)' : t.textSecondary, marginTop: 4, marginBottom: 20 }}>
              Start a 25-min focus session and build momentum.
            </ThemedText>
            <View style={[styles.heroActionBtn, { backgroundColor: t.positivity }]}>
              <ThemedText variant="label" style={{ color: '#000', fontWeight: '900', fontSize: 13 }}>Start Session</ThemedText>
              <ChevronRight size={18} color="#000" strokeWidth={3} style={{ marginLeft: 8 }} />
            </View>
          </View>
        </BentoCard>

        {/* Section: Your Insights (v4.2 Highlights) - MOVED UP */}
        <View style={[styles.sectionHeader, { marginTop: 12 }]}>
          <Star size={16} color={t.positivity} fill={t.positivity} />
          <ThemedText variant="h3" style={{ marginLeft: 8, fontSize: 16 }}>Your Highlights</ThemedText>
        </View>

        <BentoCard 
          variant="data" 
          style={{ marginBottom: 12, paddingVertical: 18 }}
          onPress={() => router.push('/(tabs)/stats' as any)}
        >
          <View style={styles.snapshotRow}>
            <View style={[styles.snapshotIcon, { backgroundColor: t.surfaceHigh }]}>
              <Trophy size={18} color={t.positivity} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <ThemedText variant="body" style={{ fontWeight: '700' }}>
                {remainingPoints > 0 
                  ? (weeklyScore > 0 ? `${remainingPoints} pts away from Catalyst ⚡` : 'Start your first ritual to earn pts ⚡')
                  : 'Catalyst Achievement Unlocked! 🚀'}
              </ThemedText>
              
              <View style={[styles.progressBarTrack, { backgroundColor: t.surfaceHigh, marginTop: 10 }]}>
                <View style={[styles.progressBarFill, { 
                  backgroundColor: t.positivity, 
                  width: `${Math.min((weeklyScore / 500) * 100, 100)}%` 
                }]} />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                <ThemedText variant="caption" color={t.textSecondary} style={{ fontSize: 10 }}>Level Progress</ThemedText>
                <ThemedText variant="label" color={t.textDisabled} style={{ fontSize: 11, letterSpacing: 1 }}>
                  {weeklyScore} / 500 PTS
                </ThemedText>
              </View>
            </View>
          </View>
        </BentoCard>

        <SmartRuleRecommendations />

        {/* Section: Your Categories (Bento 2x2) */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <LayoutGrid size={16} color={t.textDisabled} />
          <ThemedText variant="h3" style={{ marginLeft: 8, fontSize: 16 }}>Explore Catalog</ThemedText>
        </View>
        <View style={styles.bentoGrid}>
          <View style={styles.bentoRow}>
            <BentoCard 
              flex={1} 
              variant="action" 
              accent={t.learning} 
              padding={16}
              onPress={() => router.push(`/category/${CATEGORIES[0].id}` as any)}
            >
              <ThemedText variant="h3" style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={2}>
                {CATEGORIES[0].name}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                 <ThemedText variant="caption" style={{ fontWeight: '600' }} color={t.textSecondary}>
                  {getRuleCount(CATEGORIES[0].id)} rituals
                </ThemedText>
              </View>
            </BentoCard>
            <View style={{ width: 12 }} />
            <BentoCard 
              flex={1} 
              variant="action" 
              accent={t.focus} 
              padding={16}
              onPress={() => router.push(`/category/${CATEGORIES[1].id}` as any)}
            >
              <ThemedText variant="h3" style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={2}>
                {CATEGORIES[1].name}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <ThemedText variant="caption" style={{ fontWeight: '600' }} color={t.textSecondary}>
                  {getRuleCount(CATEGORIES[1].id)} rituals
                </ThemedText>
              </View>
            </BentoCard>
          </View>
          <View style={{ height: 12 }} />
          <View style={styles.bentoRow}>
            <BentoCard 
              flex={1} 
              variant="action" 
              accent={t.progress} 
              padding={16}
              onPress={() => router.push(`/category/${CATEGORIES[2].id}` as any)}
            >
              <ThemedText variant="h3" style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={2}>
                {CATEGORIES[2].name}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <ThemedText variant="caption" style={{ fontWeight: '600' }} color={t.textSecondary}>
                  {getRuleCount(CATEGORIES[2].id)} rituals
                </ThemedText>
              </View>
            </BentoCard>
            <View style={{ width: 12 }} />
            <BentoCard 
              flex={1} 
              variant="action" 
              accent={t.memory} 
              padding={16}
              onPress={() => router.push(`/category/${CATEGORIES[3].id}` as any)}
            >
              <ThemedText variant="h3" style={{ fontSize: 16, lineHeight: 22 }} numberOfLines={2}>
                {CATEGORIES[3].name}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <ThemedText variant="caption" style={{ fontWeight: '600' }} color={t.textSecondary}>
                  {getRuleCount(CATEGORIES[3].id)} rituals
                </ThemedText>
              </View>
            </BentoCard>
          </View>
        </View>


        {/* Daily Tip (v4.0 Optional) */}
        <BentoCard variant="default" style={{ marginTop: 12, backgroundColor: t.surfaceLow }}>
          <View style={styles.tipRow}>
            <Lightbulb size={20} color={t.positivity} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <ThemedText variant="label" color={t.positivity}>Daily Growth</ThemedText>
              </View>
              <ThemedText variant="caption" color={t.textSecondary} style={{ marginTop: 2 }}>
                {getDailyTip()}
              </ThemedText>
            </View>
          </View>
        </BentoCard>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  heroCard: {
    marginBottom: tokens.spacing.sectionGap,
  },
  heroContentFull: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  heroActionBtn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bentoGrid: {
    marginBottom: tokens.spacing.sectionGap,
  },
  bentoRow: {
    flexDirection: 'row',
  },
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snapshotIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
