import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircle, Clock } from 'lucide-react-native';

import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { useTheme } from '../theme/ThemeContext';
import { notifyNow } from '../services/NotificationManager';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

function resolveIntervalSeconds(rule: RuleConfig): number {
  const interval = (rule.engineConfig as Record<string, unknown>).interval;
  const intervalMinutes = (rule.engineConfig as Record<string, unknown>).intervalMinutes;

  if (typeof interval === 'number' && interval > 0) {
    return interval;
  }
  if (typeof intervalMinutes === 'number' && intervalMinutes > 0) {
    return intervalMinutes * 60;
  }
  return 20 * 60;
}

function resolveReminderMessage(rule: RuleConfig): string {
  const message = (rule.engineConfig as Record<string, unknown>).reminderMessage;
  const prompt = (rule.engineConfig as Record<string, unknown>).prompt;
  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }
  if (typeof prompt === 'string' && prompt.trim().length > 0) {
    return prompt;
  }
  return `Time for your ${rule.name} reminder.`;
}

export function IntervalReminderEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const intervalSeconds = useMemo(() => resolveIntervalSeconds(rule), [rule]);
  const reminderMessage = useMemo(() => resolveReminderMessage(rule), [rule]);

  const [nextReminder, setNextReminder] = useState(intervalSeconds);
  const [reminderCount, setReminderCount] = useState(0);
  const isRunning =
    session.phase === 'work' &&
    session.activeRuleId === rule.id &&
    !session.pausedAt;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      intervalId = setInterval(() => {
        setNextReminder((prev) => {
          if (prev <= 1) {
            notifyNow(`${rule.name} Reminder`, reminderMessage, {
              ruleId: rule.id,
              type: 'interval_reminder',
            }).catch(() => {});
            setReminderCount((count) => count + 1);
            return intervalSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, intervalSeconds, reminderMessage, rule.id, rule.name]);

  const handleStart = () => {
    if (session.activeRuleId !== rule.id) {
      setNextReminder(intervalSeconds);
      setReminderCount(0);
      session.startSession(rule.id);
    } else if (session.pausedAt) {
      session.resumeSession();
    } else if (session.phase === 'work') {
      session.pauseSession();
    }
  };

  const handleComplete = () => {
    session.endSession();
    setReminderCount(0);
    setNextReminder(intervalSeconds);
  };

  const minutes = Math.floor(nextReminder / 60);
  const seconds = nextReminder % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.display,
          {
            backgroundColor: t.isDark
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(0,0,0,0.02)',
          },
        ]}
      >
        <Clock size={48} color={color} style={styles.icon} />
        <Text style={[styles.timeText, { color: t.ink }]}>{timeString}</Text>
        <Text style={[styles.label, { color: t.inkMid }]}>to next reminder</Text>
      </View>

      <View style={[styles.counter, { borderColor: color }]}>
        <Text style={[styles.counterValue, { color }]}>{reminderCount}</Text>
        <Text style={[styles.counterLabel, { color: t.inkMid }]}>
          reminders triggered
        </Text>
      </View>

      <Text style={[styles.message, { color: t.inkDim }]}>
        {!isRunning
          ? 'Tap start to begin interval reminders'
          : session.pausedAt
            ? 'Session paused'
            : `Active - next alert in ${Math.ceil(nextReminder / 60)}m`}
      </Text>

      <View style={styles.controls}>
        <Pressable
          onPress={handleStart}
          style={[
            styles.mainBtn,
            { backgroundColor: color, opacity: isRunning ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.btnText}>
            {!isRunning ? 'Start' : session.pausedAt ? 'Resume' : 'Pause'}
          </Text>
        </Pressable>

        {session.activeRuleId === rule.id && (
          <Pressable
            onPress={handleComplete}
            style={[
              styles.endBtn,
              {
                backgroundColor: t.isDark
                  ? 'rgba(242,241,238,0.1)'
                  : 'rgba(13,13,13,0.06)',
              },
            ]}
          >
            <CheckCircle size={24} color={color} />
            <Text style={[styles.endBtnText, { color: t.ink }]}>Done</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    gap: 28,
  },
  display: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 24,
    gap: 12,
  },
  icon: {
    marginBottom: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'JetBrainsMono_700Bold',
    lineHeight: 56,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  counter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  counterLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  message: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  controls: {
    gap: 12,
    marginTop: 16,
  },
  mainBtn: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  endBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
