import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Lightbulb } from 'lucide-react-native';

const DAILY_TIPS = [
  {
    title: 'Focus on Progress',
    tip: 'Small improvements compound over time. Celebrate what you accomplish today, no matter how small.',
  },
  {
    title: 'Break It Down',
    tip: 'Large tasks feel overwhelming. Use the 1-3-5 rule: 1 big task, 3 medium, 5 small daily goals.',
  },
  {
    title: 'Eliminate Distractions',
    tip: 'Your phone steals 2+ hours a day. Put it away during focused work sessions for better results.',
  },
  {
    title: 'Use the 5-Second Rule',
    tip: 'Procrastinating? Count down from 5 and start immediately. Your brain will thank you.',
  },
  {
    title: 'Take Real Breaks',
    tip: 'Your brain needs rest. Step outside, stretch, or meditate. 5-10 minute breaks boost productivity.',
  },
  {
    title: 'Work in Chunks',
    tip: 'Use timeboxing: 25-minute focus blocks + 5-minute breaks. Your mind works best in cycles.',
  },
  {
    title: 'Review Your Day',
    tip: 'Spend 5 minutes each evening reflecting on what worked. This compounds into wisdom over time.',
  },
  {
    title: 'Start with Energy',
    tip: 'The first hour of your day sets the tone. Do your hardest task when you\'re fresh.',
  },
  {
    title: 'Track Everything',
    tip: 'What gets measured gets managed. Log your rules and tasks to see progress clearly.',
  },
  {
    title: 'Rest is Productive',
    tip: 'Sleep, movement, and play aren\'t distractions—they\'re essential for sustainable productivity.',
  },
];

export function DailyTip() {
  const t = useTheme();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Get today's tip based on day of year
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setTipIndex(dayOfYear % DAILY_TIPS.length);
  }, []);

  const currentTip = DAILY_TIPS[tipIndex];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: t.surfaceLowest,
        },
      ]}
    >
      <View style={styles.header}>
        <Lightbulb size={18} color={t.info} strokeWidth={2} />
        <Text style={[styles.tipLabel, { color: t.info }]}>Daily Tip</Text>
      </View>

      <Text style={[styles.tipTitle, { color: t.text }]}>{currentTip.title}</Text>
      <Text style={[styles.tipText, { color: t.textSecondary }]}>{currentTip.tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    marginBottom: 8,
    letterSpacing: -0.02,
  },
  tipText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});
