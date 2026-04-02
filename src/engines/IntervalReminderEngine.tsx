import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { Clock, CheckCircle } from 'lucide-react-native';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

/**
 * IntervalReminderEngine
 * Powers rules like: 20-20-20 Eye Rule, Every Hour Water Break
 * Displays countdown to next reminder with notification prompt
 */
export function IntervalReminderEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const [nextReminder, setNextReminder] = useState(rule.engineConfig.interval || 60 * 60);
  const [reminderCount, setReminderCount] = useState(0);
  const isRunning = session.phase === 'work' && session.activeRuleId === rule.id && !session.pausedAt;

  // Timer for interval reminders
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setNextReminder((prev: number) => {
          if (prev <= 1) {
            // Trigger reminder
            Alert.alert(
              `⏰ ${rule.name} Reminder`,
              rule.engineConfig.reminderMessage || `Time for your ${rule.name} break!`,
              [{ text: 'OK', onPress: () => {} }]
            );
            setReminderCount(c => c + 1);
            return rule.engineConfig.interval || 60 * 60; // Reset to next interval
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, rule]);

  const handleStart = () => {
    if (session.activeRuleId !== rule.id) {
      setNextReminder(rule.engineConfig.interval || 60 * 60);
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
  };

  const minutes = Math.floor(nextReminder / 60);
  const seconds = nextReminder % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      
      {/* Status Display */}
      <View style={[styles.display, { backgroundColor: t.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }]}>
        <Clock size={48} color={color} style={styles.icon} />
        <Text style={[styles.timeText, { color: t.ink }]}>{timeString}</Text>
        <Text style={[styles.label, { color: t.inkMid }]}>to next reminder</Text>
      </View>

      {/* Reminder Counter */}
      <View style={[styles.counter, { borderColor: color }]}>
        <Text style={[styles.counterValue, { color: color }]}>{reminderCount}</Text>
        <Text style={[styles.counterLabel, { color: t.inkMid }]}>reminders triggered</Text>
      </View>

      {/* Status Message */}
      <Text style={[styles.message, { color: t.inkDim }]}>
        {!isRunning 
          ? 'Tap start to begin interval reminders'
          : session.pausedAt 
          ? 'Session paused'
          : `Active - next alert in ${Math.ceil(nextReminder / 60)}m`
        }
      </Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable 
          onPress={handleStart}
          style={[styles.mainBtn, { backgroundColor: color, opacity: isRunning ? 0.8 : 1 }]}
        >
          <Text style={styles.btnText}>
            {!isRunning ? 'Start' : session.pausedAt ? 'Resume' : 'Pause'}
          </Text>
        </Pressable>

        {session.activeRuleId === rule.id && (
          <Pressable 
            onPress={handleComplete}
            style={[styles.endBtn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.06)' }]}
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
    fontSize: 56,
    fontWeight: '700',
    fontFamily: 'DMMono_700Bold',
    lineHeight: 64,
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
  }
});
