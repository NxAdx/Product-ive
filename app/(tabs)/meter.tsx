import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { usePositivityStore } from '../../src/store/positivityStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame } from 'lucide-react-native';

export default function PositivityMeterScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const positivity = usePositivityStore();

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.ink }]}>Positivity Meter</Text>
      </View>

      <View style={styles.content}>
        
        {/* Core Meter */}
        <View style={styles.meterContainer}>
          <Text style={[styles.pointsText, { color: t.positivity }]}>
            {positivity.weeklyScore} <Text style={{ fontSize: 24, color: t.inkMid }}>pts</Text>
          </Text>
          <Text style={[styles.levelText, { color: t.ink }]}>{positivity.currentLevel}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: t.card, borderColor: t.border }]}>
            <Flame size={24} color={t.positivity} />
            <Text style={[styles.statVal, { color: t.ink }]}>{positivity.weeklyStreak}</Text>
            <Text style={[styles.statLabel, { color: t.inkDim }]}>Day Streak</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={{fontSize: 24}}>🏆</Text>
            <Text style={[styles.statVal, { color: t.ink }]}>{positivity.lifetimeScore}</Text>
            <Text style={[styles.statLabel, { color: t.inkDim }]}>Lifetime</Text>
          </View>
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
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  meterContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  pointsText: {
    fontFamily: 'DMMono_500Medium',
    fontSize: 72,
    lineHeight: 80,
  },
  levelText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 18,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  statVal: {
    fontFamily: 'DMMono_500Medium',
    fontSize: 28,
    marginTop: 12,
  },
  statLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    marginTop: 4,
  }
});
