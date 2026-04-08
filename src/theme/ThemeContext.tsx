import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { tokens } from './tokens';

export type Mode = 'light' | 'dark' | 'system';

interface ThemeColors {
  // Base layer
  bg: string;
  
  // Surface hierarchy (for layering and bento cards)
  surfaceLowest: string;
  surfaceLow: string;
  surfaceContainer: string; // v4.0 Primary Card Surface
  surfaceHigh: string;
  surfaceHighest: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Semantic Kinetic Accents (v4.0)
  progress: string; 
  learning: string;
  focus: string;
  memory: string;
  
  // Legacy / Category mappings (Fixing Type Errors)
  learn: string;
  prod: string;
  study: string;
  
  // Semantic Alerts
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Theme extends ThemeColors {
  mode: Mode;
  resolvedMode: 'light' | 'dark';
  isDark: boolean;
  isSystem: boolean;
  toggle: () => Promise<void>;
  setMode: (mode: Mode) => Promise<void>;
  
  // Legacy / Quick access mappings
  card: string;
  ink: string;
  inkMid: string;
  inkDim: string;
  border: string;
  positivity: string;
}

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setStoredMode] = useState<Mode>('system');
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem('theme').then((v) => { 
      if (v === 'light' || v === 'dark' || v === 'system') {
        setStoredMode(v);
      }
    });
  }, []);

  const setMode = async (nextMode: Mode) => {
    setStoredMode(nextMode);
    await AsyncStorage.setItem('theme', nextMode);
  };

  const resolvedMode: 'light' | 'dark' =
    mode === 'system'
      ? systemColorScheme === 'light'
        ? 'light'
        : 'dark'
      : mode;

  const toggle = async () => {
    const next: Mode = resolvedMode === 'dark' ? 'light' : 'dark';
    await setMode(next);
  };

  const colorScheme = resolvedMode === 'dark' ? tokens.dark : tokens.light;
  
  const theme: Theme = {
    mode,
    resolvedMode,
    isDark: resolvedMode === 'dark',
    isSystem: mode === 'system',
    toggle,
    setMode,
    
    // Base
    bg: colorScheme.bg,
    
    // Surface container hierarchy
    surfaceLowest: colorScheme.surfaceContainerLowest,
    surfaceLow: colorScheme.surfaceContainerLow,
    surfaceContainer: colorScheme.surfaceContainer,
    surfaceHigh: colorScheme.surfaceContainerHigh,
    surfaceHighest: colorScheme.surfaceContainerHighest,
    
    // Text colors
    text: colorScheme.onSurface,
    textSecondary: colorScheme.onSurfaceVariant,
    textDisabled: colorScheme.onSurfaceDisabled,
    
    // Kinetic accents
    progress: colorScheme.progress,
    learning: colorScheme.learning,
    focus: colorScheme.focus,
    memory: colorScheme.memory,
    
    // Legacy mapping (v4.0 Compatibility)
    learn: colorScheme.learning,
    prod: colorScheme.positivity,
    study: colorScheme.memory,
    
    // Semantic colors
    success: colorScheme.positivity,
    warning: colorScheme.warning,
    error: colorScheme.error,
    info: colorScheme.info,
    
    // Legacy compatibility mappings
    card: colorScheme.surfaceContainer,
    ink: colorScheme.onSurface,
    inkMid: colorScheme.onSurfaceVariant,
    inkDim: colorScheme.onSurfaceDisabled,
    border: colorScheme.border,
    positivity: colorScheme.positivity,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return theme;
};
