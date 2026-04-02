import { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { useFonts } from 'expo-font';
import {
  Syne_600SemiBold,
  Syne_700Bold,
} from '@expo-google-fonts/syne';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { logRuntimeEvent } from '../src/utils/runtimeLogs';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<'(tabs)' | 'onboarding' | null>(null);

  const [fontsLoaded] = useFonts({
    Syne_600SemiBold,
    Syne_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const onboarded = await AsyncStorage.getItem('onboarded');
        setInitialRouteName(onboarded ? '(tabs)' : 'onboarding');
      } catch {
        setInitialRouteName('onboarding');
      } finally {
        setIsReady(true);
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isReady && initialRouteName) {
      SplashScreen.hideAsync();
      SystemUI.setBackgroundColorAsync('#0D0D0D'); // App background color fallback
      logRuntimeEvent('app_ready', { initialRouteName }).catch(() => {});
    }
  }, [fontsLoaded, isReady, initialRouteName]);

  if (!fontsLoaded || !isReady || !initialRouteName) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {/* We decide initialRoute logic dynamically, but expo-router defaults to matching the URL. */}
          {/* To force redirect if needed: */}
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="category/[id]" />
          <Stack.Screen name="rule/[id]" />
          <Stack.Screen name="todo" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
