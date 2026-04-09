import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CheckCircle, Pause, Play } from 'lucide-react-native';

import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { useTheme } from '../theme/ThemeContext';
import { resolveRuleSessionSeconds } from '../utils/sessionTiming';
import { insertSessionContent } from '../db/flashcardRepository';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

/**
 * FreeWriteRecallEngine
 * Powers rules: Active Recall and Blurting.
 */
export function FreeWriteRecallEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();

  const resolvedDuration = resolveRuleSessionSeconds(rule) ?? 10 * 60;
  const [sessionStarted, setSessionStarted] = useState(false);
  const [content, setContent] = useState('');
  const [tick, setTick] = useState(0);

  const wordCount = content.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const charCount = content.length;
  const sessionDuration = resolvedDuration;
  const isCurrentSession = session.activeRuleId === rule.id && session.phase === 'work';
  const isPaused = session.pausedAt !== null;
  const timerRunning = sessionStarted && isCurrentSession && !isPaused;

  useEffect(() => {
    if (!sessionStarted && isCurrentSession) {
      setSessionStarted(true);
    }
    if (sessionStarted && !isCurrentSession && session.activeRuleId !== rule.id) {
      setSessionStarted(false);
      setContent('');
    }
  }, [isCurrentSession, rule.id, session.activeRuleId, sessionStarted]);

  useEffect(() => {
    if (!timerRunning) return;

    const intervalId = setInterval(() => {
      setTick((v) => v + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerRunning]);

  const elapsedSeconds = useMemo(() => {
    if (!session.startTime || !sessionStarted) return 0;
    const now = session.pausedAt ?? Date.now();
    return Math.max(0, Math.floor((now - session.startTime) / 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.startTime, session.pausedAt, sessionStarted, tick]);

  const timeLeft = Math.max(0, sessionDuration - elapsedSeconds);

  const handleStart = () => {
    if (isCurrentSession) return;
    setSessionStarted(true);
    session.startSession(rule.id);
  };

  const handlePauseResume = () => {
    if (timerRunning) {
      session.pauseSession();
    } else {
      session.resumeSession();
    }
  };

  const handleSessionEnd = async () => {
    if (isCurrentSession) {
      // Logic Hardening: Save blurting content for later review
      if (content.length > 10) {
        // Use a stable ID for the session content link
        const timestamp = Date.now();
        const contentId = `${rule.id}_${timestamp}`;
        
        await insertSessionContent({
          session_id: contentId,
          content: content,
          created_at: new Date().toISOString(),
        });
      }
      session.endSession();
    }
    setSessionStarted(false);
    setContent('');
  };

  useEffect(() => {
    if (!sessionStarted) return;
    if (!isCurrentSession || isPaused) return;
    if (timeLeft <= 0) {
      handleSessionEnd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStarted, isCurrentSession, isPaused, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  if (!sessionStarted) {
    return (
      <KeyboardAvoidingView style={styles.intentScreen} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.intentContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.intentTitle, { color: t.ink }]}>{rule.name}</Text>
          <Text style={[styles.intentDesc, { color: t.inkMid }]}>{rule.description}</Text>

          <View style={styles.tipsBox}>
            <Text style={[styles.tipsTitle, { color: t.ink }]}>How to get the most:</Text>
            {rule.engineConfig.tips && rule.engineConfig.tips.length > 0 ? (
              rule.engineConfig.tips.map((tip: string, idx: number) => (
                <View key={idx} style={styles.tip}>
                  <Text style={[styles.tipDot, { color }]}>-</Text>
                  <Text style={[styles.tipText, { color: t.inkMid }]}>{tip}</Text>
                </View>
              ))
            ) : (
              <>
                <View style={styles.tip}>
                  <Text style={[styles.tipDot, { color }]}>-</Text>
                  <Text style={[styles.tipText, { color: t.inkMid }]}>
                    Write without stopping for {sessionDuration / 60} minutes.
                  </Text>
                </View>
                <View style={styles.tip}>
                  <Text style={[styles.tipDot, { color }]}>-</Text>
                  <Text style={[styles.tipText, { color: t.inkMid }]}>
                    Do not worry about grammar or structure.
                  </Text>
                </View>
                <View style={styles.tip}>
                  <Text style={[styles.tipDot, { color }]}>-</Text>
                  <Text style={[styles.tipText, { color: t.inkMid }]}>
                    Recall everything you know about the topic.
                  </Text>
                </View>
              </>
            )}
          </View>

          <Pressable onPress={handleStart} style={[styles.startBtn, { backgroundColor: color }]}>
            <Text style={styles.startBtnText}>Start Freewriting</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.sessionScreen}>
      <View
        style={[
          styles.statusBar,
          {
            backgroundColor: t.isDark
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(0,0,0,0.02)',
            borderColor: t.border,
          },
        ]}
      >
        <View style={styles.statusItem}>
          <Text style={[styles.statusLabel, { color: t.inkMid }]}>Time</Text>
          <Text style={[styles.statusValue, { color, fontFamily: 'JetBrainsMono_700Bold' }]}>
            {timeString}
          </Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusLabel, { color: t.inkMid }]}>Words</Text>
          <Text style={[styles.statusValue, { color, fontFamily: 'JetBrainsMono_700Bold' }]}>
            {wordCount}
          </Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusLabel, { color: t.inkMid }]}>Chars</Text>
          <Text style={[styles.statusValue, { color, fontFamily: 'JetBrainsMono_700Bold' }]}>
            {charCount}
          </Text>
        </View>
      </View>

      <TextInput
        style={[
          styles.textArea,
          {
            color: t.ink,
            backgroundColor: t.isDark
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(0,0,0,0.01)',
            borderColor: timerRunning ? color : t.border,
          },
        ]}
        placeholder="Start writing. Do not stop until the timer ends."
        placeholderTextColor={t.inkDim}
        multiline
        value={content}
        onChangeText={setContent}
        editable={timerRunning}
      />

      <View style={styles.controls}>
        <Pressable onPress={handlePauseResume} style={[styles.mainBtn, { backgroundColor: color }]}>
          {timerRunning ? (
            <>
              <Pause size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.mainBtnText}>Pause</Text>
            </>
          ) : (
            <>
              <Play size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.mainBtnText}>Resume</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={handleSessionEnd}
          style={[
            styles.endBtn,
            {
              backgroundColor: t.isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.06)',
            },
          ]}
        >
          <CheckCircle size={18} color={color} />
          <Text style={[styles.endBtnText, { color: t.ink }]}>Finish</Text>
        </Pressable>
      </View>

      {timerRunning && (
        <Animated.Text entering={FadeIn} style={[styles.reminder, { color: t.inkDim }]}>
          Keep writing. Do not stop to edit.
        </Animated.Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  intentScreen: {
    flex: 1,
  },
  intentContent: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 24,
  },
  intentTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Manrope_700Bold',
  },
  intentDesc: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },
  tipsBox: {
    gap: 12,
    paddingVertical: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tip: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipDot: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 1,
  },
  tipText: {
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
    lineHeight: 18,
  },
  startBtn: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionScreen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 14,
    justifyContent: 'space-between',
  },
  statusBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 16,
    lineHeight: 20,
  },
  statusDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  textArea: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlignVertical: 'top',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  mainBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  endBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reminder: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
