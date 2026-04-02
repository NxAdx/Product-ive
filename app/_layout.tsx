import { useEffect, useState } from 'react';
import { Stack, SplashScreen, useRouter } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { useFonts } from 'expo-font';
import {
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  DMMono_400Regular,
  DMMono_500Medium,
  DMMono_700Bold,
} from '@expo-google-fonts/dm-mono';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<'(tabs)' | 'onboarding' | null>(null);

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
    DMMono_700Bold,
  });

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const onboarded = await AsyncStorage.getItem('onboarded');
        setInitialRouteName(onboarded ? '(tabs)' : 'onboarding');
      } catch (e) {
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
          <Stack.Screen name="category/[id]" />
          <Stack.Screen name="rule/[id]" />
          <Stack.Screen name="todo" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
