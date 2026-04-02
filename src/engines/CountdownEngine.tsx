import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { Play, Square, Pause } from 'lucide-react-native';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

export function CountdownEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const [timeLeft, setTimeLeft] = useState(rule.engineConfig.workDuration || 25 * 60);
  const isRunning = session.phase === 'work' && session.activeRuleId === rule.id && !session.pausedAt;

  // Extremely basic timer implementation for standard spec requirement
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            session.endSession();
            // TODO: dispatch positivity points
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
  }, [isRunning, session]);

  const handleToggle = () => {
    if (session.activeRuleId !== rule.id) {
      setTimeLeft(rule.engineConfig.workDuration || 25 * 60);
      session.startSession(rule.id);
    } else if (session.pausedAt) {
      session.resumeSession();
    } else if (session.phase === 'work') {
      session.pauseSession();
    }
  };

  const handleStop = () => {
    session.endSession();
    setTimeLeft(rule.engineConfig.workDuration || 25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      
      {/* Circular Timer Placeholder (Needs SVG or Reanimated for ring) */}
      <View style={[styles.timerRing, { borderColor: t.border }]}>
        <Text style={[styles.timerText, { color: t.ink }]}>{timeString}</Text>
        <Text style={[styles.timerLabel, { color: t.inkDim }]}>
          {session.phase === 'work' ? (session.pausedAt ? 'PAUSED' : 'FOCUS') : 'READY'}
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
    fontFamily: 'DMMono_400Regular',
    fontSize: 56,
    lineHeight: 64,
  },
  timerLabel: {
    fontFamily: 'DMSans_700Bold',
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  }
});
