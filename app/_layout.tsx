import { useEffect, useState } from 'react';
import { Stack, SplashScreen, useRouter } from 'expo-router';
import { ThemeProvider } from '../src/theme/ThemeContext';
import { useFonts } from 'expo-font';
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
    'DMSerifDisplay': require('@expo-google-fonts/dm-serif-display/DMSerifDisplay_400Regular.ttf'),
    'DMSans_400Regular': require('@expo-google-fonts/dm-sans/DMSans_400Regular.ttf'),
    'DMSans_500Medium': require('@expo-google-fonts/dm-sans/DMSans_500Medium.ttf'),
    'DMSans_700Bold': require('@expo-google-fonts/dm-sans/DMSans_700Bold.ttf'),
    'DMMono_400Regular': require('@expo-google-fonts/dm-mono/DMMono_400Regular.ttf'),
    'DMMono_500Medium': require('@expo-google-fonts/dm-mono/DMMono_500Medium.ttf'),
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
