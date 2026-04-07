import { useEffect, useState } from 'react';
import { Stack, SplashScreen, useRouter } from 'expo-router';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { useFonts } from 'expo-font';
import {
  Syne_600SemiBold,
  Syne_700Bold,
} from '@expo-google-fonts/syne';
import {
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { logRuntimeEvent } from '../src/utils/runtimeLogs';
import { initializeNotifications, requestNotificationPermissions } from '../src/services/NotificationManager';
import notifee from '@notifee/react-native';

// Register background task for Notifee strictly outside of React lifecycle.
// This prevents Android from crashing the app when asForegroundService is used
// and keeps the JS thread alive so our setTimeout can trigger accurately.
notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    // Promise never resolves organically. 
    // It is terminated manually when stopForegroundService() is called.
  });
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * RootContent - The actual app content logic
 * Separated to ensure it's wrapped by ThemeProvider
 */
function RootContent() {
  const [isReady, setIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<'(tabs)' | 'onboarding' | null>(null);
  const { isDark } = useTheme();

  const [fontsLoaded] = useFonts({
    Syne_600SemiBold,
    Syne_700Bold,
    Manrope_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
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

  // Initialize notifications after app is ready
  useEffect(() => {
    if (isReady) {
      (async () => {
        try {
          await initializeNotifications();
          await requestNotificationPermissions();
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      })();
    }
  }, [isReady]);

  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded && isReady && initialRouteName) {
      SplashScreen.hideAsync();
      SystemUI.setBackgroundColorAsync('#000000'); // v4.0 Pitch Black
      logRuntimeEvent('app_ready', { initialRouteName }).catch(() => {});
      
      if (initialRouteName === 'onboarding') {
        // v1.0.0 Fix: Explicitly route the user to the onboarding flow
        router.replace('/onboarding');
      }
    }
  }, [fontsLoaded, isReady, initialRouteName, router]);

  if (!fontsLoaded || !isReady || !initialRouteName) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="rule/[id]" />
        <Stack.Screen name="todo" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </>
  );
}

/**
 * RootLayout - The top-level entry with Providers
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
