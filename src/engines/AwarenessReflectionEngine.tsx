import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Animated as RNAnimated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { Lightbulb, CheckCircle, RotateCcw } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

/**
 * AwarenessReflectionEngine
 * Powers rules: Parkinson's Law, 5-Second Rule
 * Provides quick awareness prompts and helps user build meta-cognition habits
 */
export function AwarenessReflectionEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [reflectionCount, setReflectionCount] = useState(0);
  const [lastPromptTime, setLastPromptTime] = useState<Date | null>(null);

  // Get reflection prompts from rule config
  const prompts = rule.engineConfig.prompts || [
    'What am I working on right now?',
    'What is my intention for this task?',
    'What would make this task feel complete?',
    'Am I procrastinating? What\'s holding me back?',
    'What\'s ONE thing I can finish in the next 5 minutes?',
    'How focused am I on this task (1-10)?',
    'What\'s distracting me from progress?',
  ];

  const ruleSpecificPrompts: { [key: string]: string[] } = {
    parkinsons_law: [
      'What is my REAL deadline for this task?',
      'What\'s the minimum viable version of this?',
      'How much time do I actually need? (Not want)',
      'What can I cut without losing quality?',
      'What\'s my time constraint?',
    ],
    five_second_rule: [
      'What action should I take RIGHT NOW?',
      '5... 4... 3... 2... 1... GO!',
      'What\'s stopping me from starting?',
      'What\'s the next micro-action?',
      'Can I start in the next 5 seconds?',
    ],
  };

  const activePrompts = ruleSpecificPrompts[rule.id] || prompts;
  const currentPrompt = activePrompts[promptIndex % activePrompts.length];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted) {
      // Show a new prompt every 2 minutes by default, or custom interval
      interval = setInterval(() => {
        showPrompt();
      }, rule.engineConfig.interval || 2 * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted, promptIndex]);

  const showPrompt = () => {
    setPromptIndex(prev => prev + 1);
    setReflectionCount(count => count + 1);
    setLastPromptTime(new Date());

    // Show an alert with the prompt
    Alert.alert(
      '💭 Reflection Prompt',
      currentPrompt,
      [
        { 
          text: 'Noted', 
          onPress: () => {
            // Self-reflection happened
          }
        }
      ]
    );
  };

  const handleStart = () => {
    setSessionStarted(true);
    session.startSession(rule.id);
    // Show first prompt after short delay
    setTimeout(showPrompt, 500);
  };

  const handleManualPrompt = () => {
    showPrompt();
  };

  const handleEnd = () => {
    session.endSession();
    setSessionStarted(false);
    Alert.alert(
      '✨ Session Complete',
      `You had ${reflectionCount} moments of reflection. Great awareness!`,
      [{ text: 'OK', onPress: () => {} }]
    );
    setReflectionCount(0);
    setPromptIndex(0);
  };

  if (!sessionStarted) {
    return (
      <View style={styles.intentScreen}>
        <View style={styles.intentContent}>
          <Text style={[styles.intentTitle, { color: t.ink }]}>
            {rule.name}
          </Text>
          <Text style={[styles.intentDesc, { color: t.inkMid }]}>
            {rule.description}
          </Text>

          {/* Key Points */}
          {rule.engineConfig.keyPoints && (
            <View style={styles.keyPoints}>
              {rule.engineConfig.keyPoints.map((point: string, idx: number) => (
                <View key={idx} style={styles.keyPoint}>
                  <Text style={[styles.keyPointDot, { color }]}>•</Text>
                  <Text style={[styles.keyPointText, { color: t.ink }]}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* How It Works */}
          <View style={[styles.howWorks, { 
            backgroundColor: t.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            borderColor: t.border
          }]}>
            <Lightbulb size={20} color={color} />
            <View>
              <Text style={[styles.howTitle, { color: t.ink }]}>
                How it works
              </Text>
              <Text style={[styles.howDesc, { color: t.inkMid }]}>
                You'll receive reflection prompts every {rule.engineConfig.interval ? `${Math.round(rule.engineConfig.interval / 60)} minutes` : '2 minutes'} to build awareness
              </Text>
            </View>
          </View>

          <Pressable 
            onPress={handleStart}
            style={[styles.startBtn, { backgroundColor: color }]}
          >
            <Text style={styles.startBtnText}>Begin {rule.name}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sessionScreen}>
      {/* Current Prompt Display */}
      <Animated.View 
        entering={FadeInDown}
        style={[styles.promptDisplay, { 
          backgroundColor: color + '15',
          borderColor: color + '40'
        }]}
      >
        <Lightbulb size={32} color={color} />
        <Text style={[styles.promptText, { color: t.ink }]}>
          {currentPrompt}
        </Text>
        <Text style={[styles.promptSub, { color: t.inkMid }]}>
          Take a moment to reflect...
        </Text>
      </Animated.View>

      {/* Stats */}
      <View style={[styles.statsBox, { 
        backgroundColor: t.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
        borderColor: t.border
      }]}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color }]}>
              {reflectionCount}
            </Text>
            <Text style={[styles.statLabel, { color: t.inkMid }]}>
              Reflections
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color }]}>
              {session.phase === 'work' ? '🟢' : '⏸️'}
            </Text>
            <Text style={[styles.statLabel, { color: t.inkMid }]}>
              Status
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable 
          onPress={handleManualPrompt}
          style={[styles.secondaryBtn, { 
            backgroundColor: t.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderColor: t.border
          }]}
        >
          <RotateCcw size={18} color={t.ink} />
          <Text style={[styles.secondaryBtnText, { color: t.ink }]}>
            New Prompt
          </Text>
        </Pressable>

        <Pressable 
          onPress={handleEnd}
          style={[styles.endBtn, { backgroundColor: color }]}
        >
          <CheckCircle size={18} color="#FFF" />
          <Text style={styles.endBtnText}>End Session</Text>
        </Pressable>
      </View>

      {/* Motivational Message */}
      <Text style={[styles.motivational, { color: t.inkDim }]}>
        Each reflection builds your self-awareness muscle 💪
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intentScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  intentContent: {
    gap: 20,
  },
  intentTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'DMSerifDisplay',
  },
  intentDesc: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  keyPoints: {
    gap: 10,
    paddingVertical: 12,
  },
  keyPoint: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  keyPointDot: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  keyPointText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 19,
  },
  howWorks: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  howTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  howDesc: {
    fontSize: 12,
    lineHeight: 16,
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
    paddingVertical: 28,
    gap: 28,
    justifyContent: 'space-between',
  },
  promptDisplay: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  promptSub: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  statsBox: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'DMMono_700Bold',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  controls: {
    gap: 12,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
  },
  endBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  motivational: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  }
});
