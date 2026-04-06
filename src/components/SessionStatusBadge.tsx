import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSessionStore } from '../store/sessionStore';
import { getRuleById } from '../data/rules';
import { Pause, Play, X, Clock } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { SessionReflection } from './SessionReflection';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { CATEGORIES } from '../data/categories';

export function SessionStatusBadge() {
  const t = useTheme();
  const activeRuleId = useSessionStore((s) => s.activeRuleId);
  const phase = useSessionStore((s) => s.phase);
  const startTime = useSessionStore((s) => s.startTime);
  const pausedAt = useSessionStore((s) => s.pausedAt);
  const pauseSession = useSessionStore((s) => s.pauseSession);
  const resumeSession = useSessionStore((s) => s.resumeSession);
  const endSession = useSessionStore((s) => s.endSession);
  const [showReflection, setShowReflection] = useState(false);

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.2, { duration: 800 }), withTiming(1, { duration: 800 })), -1);
  }, []);

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value,
  }));

  // Calculate elapsed time - must be before early returns (hooks rule)
  const elapsedSeconds = useMemo(() => {
    if (!startTime) return 0;
    const now = pausedAt || Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    // Clamp to 0 to prevent negative display
    return Math.max(0, elapsed);
  }, [startTime, pausedAt]);

  // Only show if there's an active session
  if (!activeRuleId || phase === 'idle') {
    return null;
  }

  const rule = getRuleById(activeRuleId);
  if (!rule) {
    return null;
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPaused = pausedAt !== null;
  const phaseLabel = phase === 'work' ? 'Work' : phase === 'break' ? 'Break' : 'Session';

  // Logic to show timer (v4.0 UX Optimization)
  const showTimer = useMemo(() => {
    if (rule.engine === 'countdown' || rule.engine === 'interval') return true;
    if (rule.engineConfig?.timerMode) return true;
    return false;
  }, [rule]);

  return (
    <View style={[styles.container, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
      <SessionReflection 
        visible={showReflection}
        onClose={(score) => {
          setShowReflection(false);
          endSession();
        }}
        ruleName={rule.name}
      />
      
      {/* Left side: Rule info and timer */}
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
           <ThemedText variant="caption" color={t.positivity} style={{ fontWeight: '800', letterSpacing: 1 }}>
              {CATEGORIES.find(c => c.id === rule.categoryId)?.name.toUpperCase() || 'SESSION'}
           </ThemedText>
        </View>
        <ThemedText variant="h2" style={{ fontSize: 18, marginTop: 2 }}>{rule.name}</ThemedText>
        
        {showTimer && (
          <View style={styles.timerRow}>
            <Animated.View style={[styles.pulseDot, { backgroundColor: isPaused ? t.textDisabled : t.positivity }, animatedDotStyle]} />
            <ThemedText variant="h1" style={{ fontSize: 32, fontFamily: 'JetBrainsMono_500Medium' }}>
              {formatTime(elapsedSeconds)}
            </ThemedText>
            <ThemedText variant="caption" color={t.textSecondary} style={{ marginLeft: 8 }}>
               {isPaused ? 'Paused' : 'Running'}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Right side: Quick action buttons */}
      <View style={styles.actionSection}>
        <Pressable
          onPress={() => isPaused ? resumeSession() : pauseSession()}
          style={[styles.actionBtn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.05)' }]}
        >
          {isPaused ? (
            <Play size={18} color={t.ink} strokeWidth={2.5} fill={t.ink} />
          ) : (
            <Pause size={18} color={t.ink} strokeWidth={2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => phase === 'work' ? setShowReflection(true) : endSession()}
          style={[styles.actionBtn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.05)' }]}
        >
          <X size={18} color={t.inkMid} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  infoSection: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phaseBadge: {
    fontSize: 11,
    fontFamily: 'JetBrainsMono_600SemiBold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  ruleName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontFamily: 'JetBrainsMono_500Medium',
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  }
});
