import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { Play, Square, Pause, Coffee, Target } from 'lucide-react-native';
import { resolveRuleSessionSeconds } from '../utils/sessionTiming';
import { notifyNow } from '../services/NotificationManager';
import { resumeForegroundTimer } from '../services/ForegroundTimerService';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

/**
 * CountdownEngine
 * v1.2.0: Supports Pomodoro phases and automatic cycle transitions
 */
export function CountdownEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const config = (rule.engineConfig || {}) as any;

  // Configuration thresholds
  const workS = resolveRuleSessionSeconds(rule) ?? 25 * 60;
  const breakS = (config.breakDuration ?? 5 * 60);
  const longBreakS = (config.longBreakDuration ?? 15 * 60);
  const longBreakAfter = (config.longBreakAfterCycles ?? 4);

  // Local state for phases
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(workS);
  
  const isRunning = session.activeRuleId === rule.id && !session.pausedAt;
  const lastTick = useRef<number>(Date.now());

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseTransition();
            return 0; // Value will be reset in transition
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, phase]);

  const handlePhaseTransition = () => {
    if (phase === 'work') {
      const nextCycles = cyclesCompleted + 1;
      const isLongBreak = nextCycles % longBreakAfter === 0;
      const nextDuration = isLongBreak ? longBreakS : breakS;

      notifyNow('Work Complete!', isLongBreak ? 'Time for a long break.' : 'Time for a short break.', { type: 'break_start' });
      
      setPhase('break');
      setCyclesCompleted(nextCycles);
      setTimeLeft(nextDuration);
      
      // Update foreground notification with new duration
      const nextDeadlineAtMs = Date.now() + nextDuration * 1000;
      resumeForegroundTimer(nextDeadlineAtMs).catch(console.error);

    } else {
      notifyNow('Break Over!', 'Time to focus again.', { type: 'work_start' });
      
      setPhase('work');
      setTimeLeft(workS);
      
      const nextDeadlineAtMs = Date.now() + workS * 1000;
      resumeForegroundTimer(nextDeadlineAtMs).catch(console.error);
    }
  };

  const handleToggle = () => {
    if (session.activeRuleId !== rule.id) {
      session.startSession(rule.id);
      setTimeLeft(workS);
      setPhase('work');
    } else if (session.pausedAt) {
      session.resumeSession();
    } else {
      session.pauseSession();
    }
  };

  const handleStop = () => {
    session.endSession();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      
      {/* Circular Timer Ring */}
      <View style={[styles.timerRing, { borderColor: phase === 'work' ? color : t.inkMid }]}>
        {phase === 'work' ? (
          <Target size={32} color={color} style={styles.phaseIcon} />
        ) : (
          <Coffee size={32} color={t.inkMid} style={styles.phaseIcon} />
        )}
        
        <Text style={[styles.timerText, { color: t.ink }]}>{timeString}</Text>
        <Text style={[styles.timerLabel, { color: phase === 'work' ? color : t.inkDim }]}>
          {phase === 'work' ? 'FOCUS' : 'BREAK'}
        </Text>
      </View>

      {/* Cycle Indicator */}
      <View style={styles.cycleCloud}>
        <Text style={[styles.cycleText, { color: t.inkDim }]}>
          Completed Cycles: {cyclesCompleted}
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
          style={[styles.mainBtn, { backgroundColor: phase === 'work' ? color : t.inkMid }]}
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
    paddingBottom: 40,
  },
  timerRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  phaseIcon: {
    marginBottom: 12,
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
  cycleCloud: {
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  cycleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  ctrlBtnSq: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS !== 'web' && {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    }),
  }
});
