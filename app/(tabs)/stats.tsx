import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { usePositivityStore } from '../../src/store/positivityStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Trophy, Target, Zap, TrendingUp, Check } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { tokens } from '../../src/theme/tokens';
import { ThemedText } from '../../src/components/ThemedText';
import { BentoCard } from '../../src/components/BentoCard';
import { getRuleById } from '../../src/data/rules';
import {
  getRecentSessions,
  getTodayPointDelta,
  getActivityHistory,
  getLatestWellbeingIndex,
  hasRecentlyCheckedIn,
  type SessionSummaryRecord,
  type ActivityHistoryPoint,
} from '../../src/db/sessionRepository';
import { HistoryHeatmap } from '../../src/components/HistoryHeatmap';
import { useRouter } from 'expo-router';
import { Heart, Calendar } from 'lucide-react-native';

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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const positivity = usePositivityStore();
  
  const [recentSessions, setRecentSessions] = useState<SessionSummaryRecord[]>([]);
  const [heatmapData, setHeatmapData] = useState<ActivityHistoryPoint[]>([]);
  const [wellnessIndex, setWellnessIndex] = useState<number | null>(null);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [todayDelta, setTodayDelta] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const [sessions, delta, history, latestWellness, checkedIn] = await Promise.all([
          getRecentSessions(6),
          getTodayPointDelta(),
          getActivityHistory(12),
          getLatestWellbeingIndex(),
          hasRecentlyCheckedIn(),
        ]);

        if (!cancelled) {
          setRecentSessions(sessions);
          setTodayDelta(delta);
          setHeatmapData(history);
          setWellnessIndex(latestWellness);
          setCanCheckIn(!checkedIn);
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    };

    loadHistory().catch(() => {
      if (!cancelled) setLoadingHistory(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate level progress (v4.0 Spec)
  getLevelProgress(positivity.weeklyScore);
  const displayProgress = Math.min(positivity.weeklyScore / 500, 1); // v4.5 Catalyst Goal
  const radius = 80;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * displayProgress;

  const todayDeltaText = useMemo(() => {
    if (todayDelta > 0) return `+${todayDelta} pts today`;
    if (todayDelta < 0) return `${todayDelta} pts today`;
    return '0 pts today';
  }, [todayDelta]);

  const formatDuration = (seconds: number) => {
    const total = Math.max(0, seconds);
    const mins = Math.floor(total / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

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
              <ThemedText variant="caption" style={{ color: t.positivity, fontWeight: '700' }}>{todayDeltaText}</ThemedText>
            </View>
            <View style={{ width: 1, height: 12, backgroundColor: t.border, marginTop: 2 }} />
            <View style={{ alignItems: 'center' }}>
              <ThemedText variant="caption" style={{ color: t.positivity, fontWeight: '700' }}>
                {recentSessions.length} recent sessions
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Consistency & Wellness */}
        <View style={[styles.rowAlign, { marginTop: 8, marginBottom: 12 }]}>
          <Calendar size={18} color={t.textDisabled} />
          <ThemedText variant="h3" style={{ marginLeft: 8, fontSize: 16 }}>Consistency & Wellness</ThemedText>
        </View>

        <BentoCard variant="default" style={{ backgroundColor: t.surfaceLowest, padding: 16 }}>
           <HistoryHeatmap data={heatmapData} />
           
           <View style={[styles.dividerH, { backgroundColor: t.border }]} />
           
           <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={t.textSecondary}>Latest Reliability Index</ThemedText>
                <ThemedText variant="h3" style={{ color: t.positivity }}>
                  {wellnessIndex ? `${wellnessIndex.toFixed(1)} / 5.0` : '-- / 5.0'}
                </ThemedText>
                {wellnessIndex && (
                  <ThemedText variant="caption" color={t.textSecondary} style={{ marginTop: 2 }}>
                    {wellnessIndex >= 4.5 ? 'Peak state—perfect for deep work.' :
                     wellnessIndex >= 3.5 ? 'Balanced focus. Stay consistent.' :
                     wellnessIndex >= 2.5 ? 'Low energy detected. Prioritize recovery.' :
                     'Recovery mode: stick to light tasks.'}
                  </ThemedText>
                )}
              </View>
              <Pressable
                onPress={() => router.push('/wellbeing')}
                disabled={!canCheckIn}
                style={[
                  styles.checkInBtn, 
                  { 
                    backgroundColor: canCheckIn ? t.positivity : t.surfaceHigh,
                    opacity: canCheckIn ? 1 : 0.6
                  }
                ]}
              >
                <Heart size={14} color={canCheckIn ? '#000' : t.textDisabled} />
                <ThemedText variant="label" style={{ color: canCheckIn ? '#000' : t.textDisabled, marginLeft: 8, fontWeight: '800' }}>
                  {canCheckIn ? 'Check-in' : 'Done Today'}
                </ThemedText>
              </Pressable>
           </View>
        </BentoCard>

        {/* Bento Stats Grid */}
        <View style={[styles.bentoGrid, { marginTop: 20 }]}>
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

        <View style={[styles.rowAlign, { marginTop: 24, marginBottom: 12 }]}>
          <TrendingUp size={18} color={t.textDisabled} />
          <ThemedText variant="h3" style={{ marginLeft: 8, fontSize: 16 }}>Recent Session History</ThemedText>
        </View>

        <BentoCard variant="default" style={{ backgroundColor: t.surfaceLowest }}>
          {loadingHistory ? (
            <ThemedText variant="caption" color={t.textSecondary}>
              Loading session history...
            </ThemedText>
          ) : recentSessions.length === 0 ? (
            <ThemedText variant="caption" color={t.textSecondary}>
              No completed sessions yet. Finish your first session to start your history.
            </ThemedText>
          ) : (
            <View style={{ gap: 10 }}>
              {recentSessions.map((item) => {
                const ruleName = getRuleById(item.ruleId)?.name ?? item.ruleId;
                const completed = new Date(item.completedAt);
                const completionLabel = `${completed.toLocaleDateString()} • ${completed.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`;

                return (
                  <View key={item.id} style={[styles.historyRow, { borderColor: t.border }]}>
                    <View style={{ flex: 1 }}>
                      <ThemedText variant="body" style={{ fontWeight: '700' }}>{ruleName}</ThemedText>
                      <ThemedText variant="caption" color={t.textSecondary} style={{ marginTop: 2 }}>
                        {completionLabel} • {formatDuration(item.durationSeconds)}
                      </ThemedText>
                    </View>
                    <View style={{ alignItems: 'flex-end', minWidth: 78 }}>
                      <ThemedText variant="label" style={{ color: t.positivity, fontWeight: '800' }}>
                        +{item.pointsEarned}
                      </ThemedText>
                      {typeof item.reflectionScore === 'number' && (
                        <ThemedText variant="caption" color={t.textSecondary}>
                          Reflect: {item.reflectionScore}/5
                        </ThemedText>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </BentoCard>

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
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dividerH: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
