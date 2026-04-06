import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { CheckCircle, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react-native';
import { ThemedText } from '../components/ThemedText';

import { RuleConfig } from '../data/rules';
import { useSessionStore } from '../store/sessionStore';
import { usePositivityStore } from '../store/positivityStore';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';

interface EngineProps {
  rule: RuleConfig;
  color: string;
}

interface Prompt {
  title: string;
  description: string;
  placeholder: string;
}

const DEFAULT_PROMPTS: Prompt[] = [
  {
    title: 'Step 1: Question',
    description: 'What is the main topic or concept?',
    placeholder: 'Type your response...',
  },
  {
    title: 'Step 2: Explain',
    description: 'How would you explain this in your own words?',
    placeholder: 'Explain without notes...',
  },
  {
    title: 'Step 3: Review',
    description: 'What gaps did you find in your explanation?',
    placeholder: 'List any missing pieces...',
  },
];

function coercePrompt(item: unknown, index: number): Prompt {
  if (typeof item === 'string') {
    return {
      title: `Step ${index + 1}`,
      description: item,
      placeholder: 'Write your response...',
    };
  }

  if (item && typeof item === 'object') {
    const value = item as Record<string, unknown>;
    const title =
      (typeof value.title === 'string' && value.title) || `Step ${index + 1}`;
    const description =
      (typeof value.prompt === 'string' && value.prompt) ||
      (typeof value.description === 'string' && value.description) ||
      'Describe your thinking for this step.';
    const placeholder =
      (typeof value.placeholder === 'string' && value.placeholder) ||
      'Write your response...';

    return { title, description, placeholder };
  }

  return {
    title: `Step ${index + 1}`,
    description: 'Describe your thinking for this step.',
    placeholder: 'Write your response...',
  };
}

function getPromptsFromRule(rule: RuleConfig): Prompt[] {
  const config = (rule.engineConfig ?? {}) as Record<string, unknown>;

  if (Array.isArray(config.prompts) && config.prompts.length > 0) {
    return config.prompts.map((item, index) => coercePrompt(item, index));
  }

  if (Array.isArray(config.steps) && config.steps.length > 0) {
    return config.steps.map((item, index) => coercePrompt(item, index));
  }

  if (Array.isArray(config.sections) && config.sections.length > 0) {
    return config.sections.map((section, index) =>
      coercePrompt(
        {
          title: `Section ${index + 1}`,
          prompt: `Capture notes for: ${String(section)}`,
          placeholder: `Write ${String(section)} notes...`,
        },
        index
      )
    );
  }

  if (typeof config.prompt === 'string') {
    return [
      {
        title: 'Guided Prompt',
        description: config.prompt,
        placeholder: 'Write your response...',
      },
    ];
  }

  return DEFAULT_PROMPTS;
}

export function GuidedPromptEngine({ rule, color }: EngineProps) {
  const t = useTheme();
  const session = useSessionStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [sessionStarted, setSessionStarted] = useState(false);

  const prompts = useMemo(() => getPromptsFromRule(rule), [rule]);
  const currentPrompt = prompts[currentStep] ?? prompts[0];
  const isLastStep = currentStep === prompts.length - 1;

  const handleStart = () => {
    setSessionStarted(true);
    session.startSession(rule.id);
  };

  const handleResponseChange = (text: string) => {
    setResponses((prev) => ({ ...prev, [currentStep]: text }));
  };

  const handleNext = () => {
    if (currentStep < prompts.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    session.endSession();
    usePositivityStore.getState().addPoints(rule.pointsPerSession || 15, 'rule_session', rule.id);
    setSessionStarted(false);
    setCurrentStep(0);
    setResponses({});
  };

  if (!sessionStarted) {
    return (
      <View style={styles.intentScreen}>
        <View style={styles.intentContent}>
          <ThemedText variant="h1">{rule.name}</ThemedText>
          <ThemedText variant="body" color={t.textSecondary}>{rule.description}</ThemedText>

          <View style={styles.stepsList}>
            {prompts.map((prompt, idx) => (
              <View key={`${prompt.title}-${idx}`} style={styles.stepItem}>
                <ArrowRight size={16} color={color} />
                <ThemedText variant="caption" color={t.text}>{prompt.title}</ThemedText>
              </View>
            ))}
          </View>

          <Pressable onPress={handleStart} style={[styles.startBtn, { backgroundColor: color }]}>
            <ThemedText variant="h3" style={{ color: '#000', fontWeight: '800' }}>Begin {rule.name}</ThemedText>
            <ArrowRight size={20} color="#000" strokeWidth={3} style={{ marginLeft: 12 }} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {prompts.length > 1 && (
          <ThemedText variant="label" color={t.textSecondary}>
            Step {currentStep + 1} of {prompts.length}
          </ThemedText>
        )}
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: t.isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: color,
                width: `${((currentStep + 1) / prompts.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.promptArea} contentContainerStyle={styles.promptContent} showsVerticalScrollIndicator={false}>
        <ThemedText variant="h3">{currentPrompt.title}</ThemedText>
        <ThemedText variant="body" color={t.textSecondary}>{currentPrompt.description}</ThemedText>

        <TextInput
          style={[
            styles.input,
            {
              color: t.text,
              backgroundColor: t.isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.05)',
              borderColor: t.border,
            },
          ]}
          placeholder={currentPrompt.placeholder}
          placeholderTextColor={t.textDisabled}
          multiline
          value={responses[currentStep] || ''}
          onChangeText={handleResponseChange}
        />
      </ScrollView>

      <View style={styles.controls}>
        <Pressable
          onPress={handlePrev}
          disabled={currentStep === 0}
          style={[
            styles.navBtn,
            {
              opacity: currentStep === 0 ? 0.4 : 1,
              backgroundColor: t.isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <ChevronLeft size={20} color={t.text} />
        </Pressable>

        {isLastStep ? (
          <Pressable onPress={handleComplete} style={[styles.mainBtn, { backgroundColor: color }]}>
            <CheckCircle size={20} color="#000" strokeWidth={2.5} />
            <ThemedText variant="h3" style={{ color: '#000', fontWeight: '800', fontSize: 16 }}>Complete</ThemedText>
          </Pressable>
        ) : (
          <Pressable onPress={handleNext} style={[styles.mainBtn, { backgroundColor: color }]}>
            <ThemedText variant="h3" style={{ color: '#000', fontWeight: '800', fontSize: 16 }}>Next</ThemedText>
            <ChevronRight size={20} color="#000" strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  intentScreen: {
    flex: 1,
    paddingTop: '15%',
    paddingHorizontal: 24,
  },
  intentContent: {
    gap: 20,
  },
  stepsList: {
    gap: 10,
    paddingVertical: 8,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  startBtn: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  progress: {
    gap: 12,
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  promptArea: {
    flex: 1,
    marginBottom: 24,
  },
  promptContent: {
    gap: 16,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 120,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    textAlignVertical: 'top',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
});
