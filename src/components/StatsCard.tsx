import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { usePositivityStore } from '../store/positivityStore';
import { Trophy, Flame, TrendingUp } from 'lucide-react-native';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export function StatsCard() {
  const t = useTheme();
  const { weeklyScore, weeklyStreak, todayRulesUsed } = usePositivityStore();

  const stats: StatItem[] = [
    {
      label: 'Weekly Score',
      value: weeklyScore,
      icon: <Trophy size={20} color={t.positivity} strokeWidth={2} />,
      color: t.positivity,
    },
    {
      label: 'Current Streak',
      value: weeklyStreak,
      icon: <Flame size={20} color="#FF6B6B" strokeWidth={2} />,
      color: '#FF6B6B',
    },
    {
      label: 'Rules Used Today',
      value: todayRulesUsed.length,
      icon: <TrendingUp size={20} color="#4DCFFF" strokeWidth={2} />,
      color: '#4DCFFF',
    },
  ];

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
      <Text style={[styles.title, { color: t.ink }]}>Today&apos;s Progress</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.iconContainer}>{stat.icon}</View>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: t.inkDim }]} numberOfLines={1}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
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
                width: `${Math.min((weeklyScore / 500) * 100, 100)}%`,
                backgroundColor: t.positivity,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: t.inkDim }]}>
          {weeklyScore} / 500 points this week
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 16,
    marginBottom: 16,
    letterSpacing: -0.01,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Syne_700Bold',
    fontSize: 20,
    marginBottom: 4,
    letterSpacing: -0.01,
  },
  statLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
