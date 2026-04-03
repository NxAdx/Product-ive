import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { usePositivityStore } from '../../src/store/positivityStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Flame } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { logRuntimeEvent } from '../../src/utils/runtimeLogs';

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

export default function PositivityMeterScreen() {
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const positivity = usePositivityStore();

  const { currentStart, nextTarget, progress } = getLevelProgress(positivity.weeklyScore);
  const radius = 72;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - circumference * progress;

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            logRuntimeEvent('meter_back_home').catch(() => {});
            router.navigate('/(tabs)');
          }}
          style={[
            styles.backBtn,
            { backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)', borderColor: t.border },
          ]}
        >
          <ArrowLeft size={18} color={t.ink} strokeWidth={2} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]}>Positivity Meter</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.meterContainer}>
          <Svg width={(radius + stroke) * 2} height={(radius + stroke) * 2}>
            <Circle
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              stroke={t.isDark ? 'rgba(242,241,238,0.12)' : 'rgba(13,13,13,0.12)'}
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
            <Text style={[styles.pointsText, { color: t.ink }]}>{positivity.weeklyScore}</Text>
            <Text style={[styles.pointsLabel, { color: t.inkMid }]}>weekly points</Text>
          </View>
        </View>

        <Text style={[styles.levelText, { color: t.ink }]}>{positivity.currentLevel}</Text>
        <Text style={[styles.levelSub, { color: t.inkMid }]}>Level range: {currentStart} - {nextTarget} points</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: t.card, borderColor: t.border }]}> 
            <Flame size={22} color={t.positivity} />
            <Text style={[styles.statVal, { color: t.ink }]}>{positivity.weeklyStreak}</Text>
            <Text style={[styles.statLabel, { color: t.inkDim }]}>Streak (days)</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: t.card, borderColor: t.border }]}> 
            <Text style={[styles.statVal, { color: t.ink }]}>{positivity.lifetimeScore}</Text>
            <Text style={[styles.statLabel, { color: t.inkDim }]}>Lifetime points</Text>
          </View>
        </View>

        <View style={[styles.howBox, { backgroundColor: t.card, borderColor: t.border }]}> 
          <Text style={[styles.howTitle, { color: t.ink }]}>How positivity works</Text>
          <Text style={[styles.howLine, { color: t.inkMid }]}>1. Completing a rule session adds its base points.</Text>
          <Text style={[styles.howLine, { color: t.inkMid }]}>2. First-time rule completion adds a one-time discovery bonus.</Text>
          <Text style={[styles.howLine, { color: t.inkMid }]}>3. Weekly score resets each week. Lifetime score never resets.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 28,
    letterSpacing: -0.02,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 14,
  },
  meterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  meterCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  pointsText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 38,
    lineHeight: 42,
  },
  pointsLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  levelText: {
    textAlign: 'center',
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    marginTop: 4,
    letterSpacing: -0.02,
  },
  levelSub: {
    textAlign: 'center',
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 11,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  statVal: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 24,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  howBox: {
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  howTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    letterSpacing: -0.02,
  },
  howLine: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});
