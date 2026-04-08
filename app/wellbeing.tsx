import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { tokens } from '../src/theme/tokens';
import { ThemedText } from '../src/components/ThemedText';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Brain, Zap, Heart, Moon, Wind, CheckCircle2 } from 'lucide-react-native';
import { usePositivityStore } from '../src/store/positivityStore';
import { saveWellbeingAssessment } from '../src/db/sessionRepository';
import { logRuntimeEvent } from '../src/utils/runtimeLogs';

const QUESTIONS = [
  { id: 'focus', label: 'Mental Focus', desc: 'Clarity and cognitive discipline', icon: Brain },
  { id: 'energy', label: 'Physical Energy', desc: 'Readiness for movement or output', icon: Zap },
  { id: 'mood', label: 'Emotional State', desc: 'Stable, positive emotional baseline', icon: Heart },
  { id: 'sleep', label: 'Rest Quality', desc: 'Restorative capacity of last sleep', icon: Moon },
  { id: 'stress', label: 'System Stress', desc: 'Nervous system load (Inverse)', icon: Wind },
];

export default function WellbeingScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

  const handleScore = (score: number) => {
    const newScores = { ...scores, [currentQuestion.id]: score };
    setScores(newScores);
    
    if (isLastStep) {
      handleComplete(newScores);
    } else {
      setStep(step + 1);
    }
  };

  const handleComplete = async (finalScores: Record<string, number>) => {
    setIsFinishing(true);
    try {
      const avgScore = Object.values(finalScores).reduce((a, b) => a + b, 0) / QUESTIONS.length;
      const assessmentId = `wb_${Date.now()}`;
      
      await saveWellbeingAssessment({
        id: assessmentId,
        score: avgScore,
        category: 'daily_checkin',
        notes: JSON.stringify(finalScores),
        createdAt: Date.now(),
      });

      // Award Points
      usePositivityStore.getState().addPoints(5, 'daily_wellness', 'wellbeing_checkin');
      
      await logRuntimeEvent('wellbeing_checkin_complete', { assessmentId, avgScore });
      
      // Navigate back to stats
      setTimeout(() => {
        router.replace('/(tabs)/stats');
      }, 1500);
    } catch (error) {
      console.error('Failed to save assessment:', error);
      setIsFinishing(false);
    }
  };

  if (isFinishing) {
    return (
      <View style={[styles.container, { backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <CheckCircle2 size={64} color={t.positivity} />
        <ThemedText variant="h2" style={{ marginTop: 24 }}>Resilience Fixed</ThemedText>
        <ThemedText variant="body" color={t.textSecondary} style={{ marginTop: 8 }}>+5 Points Awarded</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={t.ink} />
        </Pressable>
        <View style={styles.progressContainer}>
           <View style={[styles.progressBar, { backgroundColor: t.isDark ? '#222' : '#eee' }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: t.positivity, 
                    width: `${((step + 1) / QUESTIONS.length) * 100}%` 
                  }
                ]} 
              />
           </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionIcon}>
           <currentQuestion.icon size={48} color={t.positivity} />
        </View>
        
        <ThemedText variant="h1" style={styles.title}>{currentQuestion.label}</ThemedText>
        <ThemedText variant="body" color={t.textSecondary} style={styles.description}>
          {currentQuestion.desc}
        </ThemedText>

        <View style={styles.optionsGrid}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Pressable
              key={num}
              onPress={() => handleScore(num)}
              style={({ pressed }) => [
                styles.optionBtn,
                { 
                  backgroundColor: t.surfaceLow,
                  borderColor: t.border,
                  opacity: pressed ? 0.7 : 1
                }
              ]}
            >
              <ThemedText variant="h1" style={{ fontSize: 32 }}>{num}</ThemedText>
              <ThemedText variant="caption" color={t.textSecondary}>
                {num === 1 ? 'Low' : num === 5 ? 'High' : ''}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
         <ThemedText variant="caption" color={t.textDisabled} style={{ textAlign: 'center', marginBottom: 12 }}>
           Step {step + 1} of {QUESTIONS.length}
         </ThemedText>
         <ThemedText variant="caption" color={t.textDisabled} style={{ textAlign: 'center', fontSize: 10, lineHeight: 14 }}>
           Self-reflection tool only. Not a medical diagnosis or substitute for professional care.
         </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: tokens.spacing.padding,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    paddingHorizontal: tokens.spacing.padding * 1.5,
    paddingTop: 60,
    alignItems: 'center',
  },
  questionIcon: {
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 64,
  },
  optionsGrid: {
    width: '100%',
    gap: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: tokens.spacing.padding,
  }
});
