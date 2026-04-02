import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSessionStore } from '../store/sessionStore';
import { getRuleById } from '../data/rules';
import { Pause, Play, X, Clock } from 'lucide-react-native';

export function SessionStatusBadge() {
  const t = useTheme();
  const activeRuleId = useSessionStore((s) => s.activeRuleId);
  const phase = useSessionStore((s) => s.phase);
  const startTime = useSessionStore((s) => s.startTime);
  const pausedAt = useSessionStore((s) => s.pausedAt);
  const pauseSession = useSessionStore((s) => s.pauseSession);
  const resumeSession = useSessionStore((s) => s.resumeSession);
  const endSession = useSessionStore((s) => s.endSession);

  // Calculate elapsed time - must be before early returns (hooks rule)
  const elapsedSeconds = useMemo(() => {
    if (!startTime) return 0;
    const now = pausedAt || Date.now();
    return Math.floor((now - startTime) / 1000);
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

  return (
    <View style={[styles.container, { backgroundColor: t.card, borderColor: t.border }]}>
      {/* Left side: Rule info and timer */}
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <Text style={[styles.phaseBadge, { color: phase === 'work' ? '#FF6B6B' : '#26C485' }]}>
            {phaseLabel}
          </Text>
          <Text style={[styles.ruleName, { color: t.ink }]} numberOfLines={1}>
            {rule.name}
          </Text>
        </View>
        <View style={styles.timerRow}>
          <Clock size={14} color={t.inkDim} />
          <Text style={[styles.timerText, { color: t.inkMid }]}>
            {formatTime(elapsedSeconds)}
          </Text>
        </View>
      </View>

      {/* Right side: Quick action buttons */}
      <View style={styles.actionSection}>
        <Pressable
          onPress={() => isPaused ? resumeSession() : pauseSession()}
          style={[styles.actionBtn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.05)' }]}
        >
          {isPaused ? (
            <Play size={16} color={t.ink} strokeWidth={2.5} fill={t.ink} />
          ) : (
            <Pause size={16} color={t.ink} strokeWidth={2} />
          )}
        </Pressable>
        <Pressable
          onPress={() => endSession()}
          style={[styles.actionBtn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.05)' }]}
        >
          <X size={16} color={t.inkMid} strokeWidth={2.5} />
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
    borderWidth: 1,
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
    fontFamily: 'PlusJakartaSans_600SemiBold',
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
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
