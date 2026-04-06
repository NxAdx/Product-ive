import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Animated, LayoutAnimation, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/theme/ThemeContext';
import { tokens } from '../src/theme/tokens';
import { ThemedText } from '../src/components/ThemedText';
import { BentoCard } from '../src/components/BentoCard';
import { ChevronRight, Check, Bell, Zap, Target, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestNotificationPermissions } from '../src/services/NotificationManager';
import { useSettingsStore } from '../src/store/settingsStore';
import { TextInput } from 'react-native';

type OnboardingStep = 'welcome' | 'name' | 'goal' | 'availability' | 'permissions' | 'success';

export default function OnboardingScreen() {
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const userName = useSettingsStore((s) => s.userName);
  const setUserName = useSettingsStore((s) => s.setUserName);
  
  const [tempName, setTempName] = useState(userName === 'User' ? '' : userName);
  const [goal, setGoal] = useState<string | null>(null);

  const nextStep = (next: OnboardingStep) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(next);
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboarded', '1');
    if (goal) await AsyncStorage.setItem('user_goal', goal);
    router.replace('/(tabs)');
  };

  const handlePermissions = async () => {
    try {
      await requestNotificationPermissions();
    } finally {
      nextStep('success');
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Zap size={64} color={t.positivity} style={{ marginBottom: 24 }} />
      <ThemedText variant="h1">Build consistent productive habits</ThemedText>
      <ThemedText variant="bodyLg" color={t.textSecondary} style={{ marginTop: 12 }}>
        Master your focus with science-backed rituals designed for your daily life.
      </ThemedText>
      <Pressable 
        onPress={() => nextStep('name')} 
        style={[styles.primaryBtn, { backgroundColor: t.positivity, marginTop: 48 }]}
      >
        <ThemedText variant="h3" color="#fff">Get Started</ThemedText>
        <ChevronRight size={20} color="#fff" style={{ marginLeft: 8 }} />
      </Pressable>
    </View>
  );

  const renderName = () => (
    <View style={styles.stepContainer}>
      <Target size={64} color={t.positivity} style={{ marginBottom: 24 }} />
      <ThemedText variant="h2">What should we call you?</ThemedText>
      <ThemedText variant="body" color={t.textSecondary} style={{ marginTop: 8, marginBottom: 32 }}>
        Your rituals are personal. Your dashboard should be too.
      </ThemedText>
      
      <View style={[styles.inputWrapper, { backgroundColor: t.surfaceContainer, borderColor: t.border }]}>
        <TextInput
          value={tempName}
          onChangeText={setTempName}
          placeholder="Enter your name"
          placeholderTextColor={t.textDisabled}
          autoFocus
          style={[styles.textInput, { color: t.text }]}
        />
      </View>

      <Pressable 
        disabled={!tempName.trim()}
        onPress={() => {
          setUserName(tempName.trim());
          nextStep('goal');
        }} 
        style={[
          styles.primaryBtn, 
          { backgroundColor: tempName.trim() ? t.positivity : t.surfaceHigh, marginTop: 32 }
        ]}
      >
        <ThemedText variant="h3" color={tempName.trim() ? "#fff" : t.textDisabled}>Continue</ThemedText>
      </Pressable>
    </View>
  );

  const renderGoal = () => (
    <View style={styles.stepContainer}>
      <ThemedText variant="h2">What is your primary goal?</ThemedText>
      <ThemedText variant="body" color={t.textSecondary} style={{ marginBottom: 32 }}>
        We will personalize your dashboard based on your focus.
      </ThemedText>
      <View style={{ gap: 12 }}>
        <BentoCard 
          accent={t.learning} 
          variant={goal === 'Study' ? 'action' : 'default'} 
          onPress={() => setGoal('Study')}
        >
          <View style={styles.row}>
            <BookOpen size={24} color={t.learning} />
            <ThemedText variant="h3" style={{ marginLeft: 16 }}>Ace my studies</ThemedText>
          </View>
        </BentoCard>
        <BentoCard 
          accent={t.focus} 
          variant={goal === 'Focus' ? 'action' : 'default'} 
          onPress={() => setGoal('Focus')}
        >
          <View style={styles.row}>
            <Target size={24} color={t.focus} />
            <ThemedText variant="h3" style={{ marginLeft: 16 }}>Deep focus work</ThemedText>
          </View>
        </BentoCard>
        <BentoCard 
          accent={t.progress} 
          variant={goal === 'Productivity' ? 'action' : 'default'} 
          onPress={() => setGoal('Productivity')}
        >
          <View style={styles.row}>
            <Zap size={24} color={t.progress} />
            <ThemedText variant="h3" style={{ marginLeft: 16 }}>General productivity</ThemedText>
          </View>
        </BentoCard>
      </View>
      <Pressable 
        disabled={!goal}
        onPress={() => nextStep('permissions')} 
        style={[
          styles.primaryBtn, 
          { backgroundColor: goal ? t.positivity : t.surfaceHigh, marginTop: 32 }
        ]}
      >
        <ThemedText variant="h3" color={goal ? "#fff" : t.textDisabled}>Continue</ThemedText>
      </Pressable>
    </View>
  );

  const renderPermissions = () => (
    <View style={styles.stepContainer}>
      <Bell size={64} color={t.info} style={{ marginBottom: 24 }} />
      <ThemedText variant="h2">Never miss a session</ThemedText>
      <ThemedText variant="bodyLg" color={t.textSecondary} style={{ marginTop: 12 }}>
        We only send reminders for your scheduled focus rituals and streak warnings.
      </ThemedText>
      <Pressable 
        onPress={handlePermissions} 
        style={[styles.primaryBtn, { backgroundColor: t.info, marginTop: 48 }]}
      >
        <ThemedText variant="h3" color="#fff">Enable Notifications</ThemedText>
      </Pressable>
      <Pressable onPress={() => nextStep('success')} style={{ marginTop: 24, alignSelf: 'center' }}>
        <ThemedText variant="caption" color={t.textDisabled}>Maybe later</ThemedText>
      </Pressable>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.checkCircle, { backgroundColor: t.positivity }]}>
        <Check size={40} color="#fff" strokeWidth={3} />
      </View>
      <ThemedText variant="h1" align="center">You\'re all set!</ThemedText>
      <ThemedText variant="bodyLg" align="center" color={t.textSecondary} style={{ marginTop: 12 }}>
        Your personalized {goal?.toLowerCase()} ritual dashboard is ready.
      </ThemedText>
      <Pressable 
        onPress={handleFinish} 
        style={[styles.primaryBtn, { backgroundColor: t.positivity, marginTop: 48 }]}
      >
        <ThemedText variant="h3" color="#fff">Go to Dashboard</ThemedText>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {step === 'welcome' && renderWelcome()}
      {step === 'name' && renderName()}
      {step === 'goal' && renderGoal()}
      {step === 'permissions' && renderPermissions()}
      {step === 'success' && renderSuccess()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: tokens.spacing.padding,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryBtn: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  inputWrapper: {
    height: 64,
    borderRadius: tokens.radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    height: '100%',
  }
});
