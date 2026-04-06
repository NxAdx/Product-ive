import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from './tokens';

export type Mode = 'light' | 'dark';

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
  
  // Semantic Alerts
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface Theme extends ThemeColors {
  mode: Mode;
  isDark: boolean;
  toggle: () => Promise<void>;
  
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
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((v) => { 
      if (v) setMode(v as Mode); 
    });
  }, []);

  const toggle = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    await AsyncStorage.setItem('theme', next);
  };

  const colorScheme = mode === 'dark' ? tokens.dark : tokens.light;
  
  const theme: Theme = {
    mode,
    isDark: mode === 'dark',
    toggle,
    
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
    
    // Semantic colors
    success: colorScheme.success,
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
