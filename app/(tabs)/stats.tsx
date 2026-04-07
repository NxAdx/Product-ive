import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { usePositivityStore } from '../../src/store/positivityStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Trophy, Target, Zap, TrendingUp, Check } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { tokens } from '../../src/theme/tokens';
import { ThemedText } from '../../src/components/ThemedText';
import { BentoCard } from '../../src/components/BentoCard';

const LEVEL_STEPS = [0, 100, 250, 500, 1000];

function getLevelProgress(score: number) {
  const currentStart = [...LEVEL_STEPS].reverse().find((v) => score >= v) ?? 0;
  const nextTarget = LEVEL_STEPS.find((v) => v > score) ?? currentStart;
  if (nextTarget === currentStart) {
    return { currentStart, nextTarget, progress: 1 };
  }
  return {
    currentStart,
    nextTarget,
    progress: (score - currentStart) / (nextTarget - currentStart),
  };
}

export default function StatsScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const positivity = usePositivityStore();

  // Calculate level progress (v4.0 Spec)
  getLevelProgress(positivity.weeklyScore);
  const displayProgress = Math.min(positivity.weeklyScore / 500, 1); // v4.5 Catalyst Goal
  const radius = 80;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * displayProgress;

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + tokens.spacing.md,
          paddingBottom: insets.bottom + 160, 
          paddingHorizontal: tokens.spacing.padding 
        }}
      >
        <ThemedText variant="h1" style={{ marginBottom: 4 }}>Your Progress</ThemedText>
        <ThemedText variant="body" color={t.textSecondary}>Tracking your journey to Legend</ThemedText>

        {/* Central Progress Circle */}
        <View style={styles.meterContainer}>
          <Svg width={(radius + stroke) * 2} height={(radius + stroke) * 2}>
            <Circle
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              stroke={t.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              strokeWidth={stroke}
              fill="none"
            />
            <Circle
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              stroke={t.positivity}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius + stroke} ${radius + stroke})`}
            />
          </Svg>

          <View style={styles.meterCenter}>
            <ThemedText variant="h1" style={{ fontSize: 48, lineHeight: 54 }}>{positivity.weeklyScore}</ThemedText>
            <ThemedText variant="label" color={t.textSecondary}>Weekly Points</ThemedText>
          </View>
        </View>

        {/* Gamification Indicator */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={[styles.rankBadge, { backgroundColor: t.isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)', borderColor: t.positivity }]}>
             <Trophy size={14} color={t.positivity} />
             <ThemedText variant="label" style={{ color: t.positivity, marginLeft: 8, fontWeight: '700' }}>
                Level: {positivity.currentLevel}
             </ThemedText>
          </View>
          <ThemedText variant="caption" color={t.textDisabled} style={{ marginTop: 12 }}>
            {500 - positivity.weeklyScore > 0 ? `${500 - positivity.weeklyScore} pts until Catalyst` : 'Catalyst Achievement Unlocked'}
          </ThemedText>
          
          {/* Daily Delta (v7.0 Retention Engine) */}
          <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <ThemedText variant="caption" style={{ color: t.positivity, fontWeight: '700' }}>+15 pts today</ThemedText>
            </View>
            <View style={{ width: 1, height: 12, backgroundColor: t.border, marginTop: 2 }} />
            <View style={{ alignItems: 'center' }}>
              <ThemedText variant="caption" style={{ color: t.positivity, fontWeight: '700' }}>+12% vs last week</ThemedText>
            </View>
          </View>
        </View>

        {/* Bento Stats Grid */}
        <View style={styles.bentoGrid}>
          <View style={styles.bentoRow}>
            <BentoCard flex={1} variant="data" accent={t.focus} padding={20}>
              <Flame size={24} color={t.focus} fill={t.focus} />
              <ThemedText variant="h2" style={{ marginTop: 12 }}>{positivity.weeklyStreak}</ThemedText>
              <ThemedText variant="label" color={t.textSecondary}>Day Streak</ThemedText>
            </BentoCard>
            <View style={{ width: 12 }} />
            <BentoCard flex={1} variant="data" accent={t.progress} padding={20}>
              <Zap size={24} color={t.progress} fill={t.progress} />
              <ThemedText variant="h2" style={{ marginTop: 12 }}>{positivity.lifetimeScore}</ThemedText>
              <ThemedText variant="label" color={t.textSecondary}>Total XP</ThemedText>
            </BentoCard>
          </View>
          
          <View style={{ height: 12 }} />

          <BentoCard variant="default" style={{ backgroundColor: t.surfaceLowest }}>
            <View style={styles.rowAlign}>
              <TrendingUp size={20} color={t.info} />
              <ThemedText variant="h3" style={{ marginLeft: 12 }}>Weekly Summary</ThemedText>
            </View>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <ThemedText variant="label" color={t.textDisabled}>Focus Sessions</ThemedText>
                <ThemedText variant="h3" style={{ fontSize: 18 }}>{positivity.weeklySessionsCompleted} this week</ThemedText>
              </View>
              <View style={[styles.divider, { backgroundColor: t.border }]} />
              <View style={styles.summaryItem}>
                <ThemedText variant="label" color={t.textDisabled}>Focus Time</ThemedText>
                <ThemedText variant="h3" style={{ fontSize: 18 }}>{(positivity.weeklyFocusTimeSeconds / 3600).toFixed(1)} hrs</ThemedText>
              </View>
            </View>
          </BentoCard>
        </View>

        {/* Level Path Mentions */}
        <View style={[styles.rowAlign, { marginTop: 32, marginBottom: 16 }]}>
           <Target size={18} color={t.textDisabled} />
           <ThemedText variant="h3" style={{ marginLeft: 8, fontSize: 16 }}>Your Milestone Path</ThemedText>
        </View>
        
        <View style={styles.pathLadder}>
           <View style={[styles.pathStep, { borderColor: t.positivity, backgroundColor: t.isDark ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.02)' }]}>
              <Check size={14} color={t.positivity} />
              <ThemedText variant="body" style={{ marginLeft: 16, fontWeight: '700', color: t.text }}>Getting Started</ThemedText>
              <ThemedText variant="caption" color={t.positivity} style={{ marginLeft: 'auto', fontWeight: '800' }}>UNLOCKED</ThemedText>
           </View>
           <View style={styles.pathLine} />
           <View style={[styles.pathStep, { borderColor: t.warning }]}>
              <Zap size={14} color={t.warning} />
              <ThemedText variant="body" style={{ marginLeft: 16, fontWeight: '600', color: t.text }}>Catalyst</ThemedText>
              <ThemedText variant="caption" color={t.textSecondary} style={{ marginLeft: 'auto' }}>500 Pts</ThemedText>
           </View>
           <View style={styles.pathLine} />
           <View style={[styles.pathStep, { borderColor: t.textDisabled, opacity: 0.7 }]}>
              <Trophy size={14} color={t.textDisabled} />
              <ThemedText variant="body" style={{ marginLeft: 16, fontWeight: '600', color: t.textSecondary }}>Legend</ThemedText>
              <ThemedText variant="caption" color={t.textDisabled} style={{ marginLeft: 'auto' }}>1000 Pts</ThemedText>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  meterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  meterCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  bentoGrid: {
    width: '100%',
  },
  bentoRow: {
    flexDirection: 'row',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryContent: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 16,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pathLadder: {
    gap: 0,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  pathLine: {
    width: 2,
    height: 12,
    backgroundColor: 'rgba(128,128,128,0.2)',
    marginLeft: 23,
  }
});
