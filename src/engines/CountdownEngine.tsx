import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { Play, Square, Pause } from 'lucide-react-native';
import { usePositivityStore } from '../store/positivityStore';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

export function CountdownEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const initialTime = rule.engineConfig.workDuration || 0;
  const isStopwatch = initialTime === 0;

  // Sync local time with session store on mount or when session becomes active
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (session.activeRuleId === rule.id && session.startTime) {
      const elapsedTotal = Math.floor((Date.now() - session.startTime) / 1000);
      
      // If we are currently paused, the time should be based on when we paused
      if (session.pausedAt) {
        const elapsedUntilPause = Math.floor((session.pausedAt - session.startTime) / 1000);
        if (isStopwatch) {
          setTime(elapsedUntilPause);
        } else {
          setTime(Math.max(0, initialTime - elapsedUntilPause));
        }
      } else {
        if (isStopwatch) {
          setTime(elapsedTotal);
        } else {
          setTime(Math.max(0, initialTime - elapsedTotal));
        }
      }
    } else {
      setTime(initialTime);
    }
  }, [session.activeRuleId, session.startTime, session.pausedAt, rule.id, initialTime, isStopwatch]);

  const isRunning = session.phase === 'work' && session.activeRuleId === rule.id && !session.pausedAt;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev: number) => {
          if (isStopwatch) {
            return prev + 1;
          }
          if (prev <= 1) {
            session.endSession();
            usePositivityStore.getState().addPoints(rule.pointsPerSession || 25, 'rule_session', rule.id);
            return 0;
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
  }, [isRunning, isStopwatch, rule, session]);

  const handleToggle = () => {
    if (session.activeRuleId !== rule.id) {
      setTime(initialTime);
      session.startSession(rule.id);
    } else if (session.pausedAt) {
      session.resumeSession();
    } else if (session.phase === 'work') {
      session.pauseSession();
    }
  };

  const handleStop = () => {
    session.endSession();
    setTime(initialTime);
  };

  const minutes = Math.floor(Math.abs(time) / 60);
  const seconds = Math.abs(time) % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      
      {/* Circular Timer Ring */}
      <View style={[styles.timerRing, { borderColor: t.border }]}>
        <Text style={[styles.timerText, { color: t.ink }]}>{timeString}</Text>
        <Text style={[styles.timerLabel, { color: t.inkDim }]}>
          {session.phase === 'work' 
            ? (session.pausedAt ? 'PAUSED' : (isStopwatch ? 'ELAPSED' : 'FOCUS')) 
            : 'READY'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {session.activeRuleId === rule.id && (
          <Pressable 
            onPress={handleStop}
            style={[styles.ctrlBtnSq, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.06)' }]}
          >
            <Square size={20} color={t.inkMid} fill={t.inkMid} />
          </Pressable>
        )}
        
        <Pressable 
          onPress={handleToggle}
          style={[styles.mainBtn, { backgroundColor: color }]}
        >
          {isRunning ? (
            <Pause size={32} color="#FFF" fill="#FFF" />
          ) : (
            <Play size={32} color="#FFF" fill="#FFF" style={{ marginLeft: 4 }} />
          )}
        </Pressable>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40, // accommodate bottom spacing
  },
  timerRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 64,
  },
  timerText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 56,
    lineHeight: 64,
  },
  timerLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  ctrlBtnSq: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS !== 'web' && {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    }),
    ...(Platform.OS === 'web' && {
      boxShadow: '0 8px 16px rgba(13, 13, 13, 0.3)',
    }),
  }
});
