import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../src/theme/ThemeContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const t = useTheme();

  const handleContinue = async () => {
    await AsyncStorage.setItem('onboarded', '1');
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <Text style={[styles.title, { color: t.ink }]}>Welcome to Product +ive</Text>
      <Text style={[styles.subtitle, { color: t.inkMid }]}>
        Build focus and study habits with guided rule sessions.
      </Text>

      <Pressable onPress={handleContinue} style={[styles.button, { backgroundColor: t.positivity }]}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
  },
});


