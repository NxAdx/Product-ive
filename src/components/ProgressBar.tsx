import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { usePositivityStore } from '../store/positivityStore';
import { Target } from 'lucide-react-native';

const MILESTONES = [
  { points: 100, label: 'Starter', icon: '🚀' },
  { points: 250, label: 'Catalyst', icon: '⚡' },
  { points: 500, label: 'Master', icon: '👑' },
  { points: 1000, label: 'Legend', icon: '🌟' },
];

export function ProgressBar() {
  const t = useTheme();
  const { weeklyScore } = usePositivityStore();

  const currentMilestone = useMemo(() => {
    return MILESTONES.find((m) => weeklyScore < m.points) || MILESTONES[MILESTONES.length - 1];
  }, [weeklyScore]);

  const previousMilestone = useMemo(() => {
    const index = MILESTONES.indexOf(currentMilestone);
    return index > 0 ? MILESTONES[index - 1] : null;
  }, [currentMilestone]);

  const progressPercentage = useMemo(() => {
    const prevPoints = previousMilestone?.points || 0;
    const currPoints = currentMilestone.points;
    const range = currPoints - prevPoints;
    const progress = weeklyScore - prevPoints;
    return Math.min((progress / range) * 100, 100);
  }, [weeklyScore, previousMilestone, currentMilestone]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: t.isDark ? 'rgba(242,241,238,0.06)' : 'rgba(13,13,13,0.03)',
          borderColor: t.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Target size={18} color={t.positivity} strokeWidth={2} />
          <Text style={[styles.title, { color: t.ink }]}>Weekly Milestone</Text>
        </View>
        <Text style={[styles.currentScore, { color: t.positivity }]}>{weeklyScore} pts</Text>
      </View>

      {/* Main progress bar */}
      <View
        style={[
          styles.progressBar,
          {
            backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.06)',
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
              backgroundColor: t.positivity,
            },
          ]}
        />
      </View>

      {/* Milestone label */}
      <View style={styles.milestoneInfo}>
        <Text style={[styles.milestoneLabel, { color: t.inkDim }]}>
          Goal: <Text style={{ color: t.ink, fontFamily: 'Syne_700Bold' }}>
            {currentMilestone.label}
          </Text>{' '}
          ({currentMilestone.points} pts)
        </Text>
        <Text style={[styles.pointsRemaining, { color: t.positivity }]}>
          {Math.max(0, currentMilestone.points - weeklyScore)} to go
        </Text>
      </View>

      {/* Milestone badges row */}
      <View style={styles.milestonesRow}>
        {MILESTONES.map((milestone, index) => {
          const isActive = weeklyScore >= milestone.points;
          const isCurrent = milestone === currentMilestone;

          return (
            <View key={index} style={styles.milestoneBadge}>
              <View
                style={[
                  styles.badgeCircle,
                  {
                    backgroundColor: isActive
                      ? t.positivity
                      : t.isDark
                        ? 'rgba(242,241,238,0.1)'
                        : 'rgba(13,13,13,0.06)',
                    borderColor: isCurrent ? t.positivity : 'transparent',
                    borderWidth: isCurrent ? 2 : 0,
                  },
                ]}
              >
                <Text style={styles.milestoneBadgeText}>{milestone.icon}</Text>
              </View>
              <Text style={[styles.badgeLabel, { color: t.inkDim }]} numberOfLines={1}>
                {milestone.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    marginLeft: 10,
    letterSpacing: -0.01,
  },
  currentScore: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    letterSpacing: -0.01,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  milestoneInfo: {
    marginBottom: 16,
  },
  milestoneLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    marginBottom: 4,
  },
  pointsRemaining: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  milestonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'transparent', // Will be styled by parent bg
  },
  milestoneBadge: {
    alignItems: 'center',
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  milestoneBadgeText: {
    fontSize: 20,
  },
  badgeLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
  },
});
