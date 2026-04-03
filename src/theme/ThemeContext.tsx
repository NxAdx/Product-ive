import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from './tokens';

export type Mode = 'light' | 'dark';

interface ThemeColors {
  // Base
  bg: string;
  
  // Surface hierarchy (for layering)
  surfaceLowest: string;
  surfaceLow: string;
  surface: string;
  surfaceHigh: string;
  surfaceHighest: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Kinetic accents
  primary: string;
  primaryDim: string;
  primaryBright: string;
  
  secondary: string;
  secondaryDim: string;
  secondaryBright: string;
  
  tertiary: string;
  tertiaryDim: string;
  tertiaryBright: string;
  
  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Category colors
  learn: string;
  focus: string;
  prod: string;
  study: string;
}

interface Theme extends ThemeColors {
  mode: Mode;
  isDark: boolean;
  toggle: () => Promise<void>;
  
  // Legacy compatibility (deprecated, use semantic colors instead)
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
    surface: colorScheme.surfaceContainer,
    surfaceHigh: colorScheme.surfaceContainerHigh,
    surfaceHighest: colorScheme.surfaceContainerHighest,
    
    // Text colors
    text: colorScheme.onSurface,
    textSecondary: colorScheme.onSurfaceVariant,
    textDisabled: colorScheme.onSurfaceDisabled,
    
    // Kinetic accents (primary, secondary, tertiary)
    primary: colorScheme.primary,
    primaryDim: colorScheme.primaryDim,
    primaryBright: colorScheme.primaryBright,
    
    secondary: colorScheme.secondary,
    secondaryDim: colorScheme.secondaryDim,
    secondaryBright: colorScheme.secondaryBright,
    
    tertiary: colorScheme.tertiary,
    tertiaryDim: colorScheme.tertiaryDim,
    tertiaryBright: colorScheme.tertiaryBright,
    
    // Semantic colors
    success: colorScheme.success,
    warning: colorScheme.warning,
    error: colorScheme.error,
    info: colorScheme.info,
    
    // Category colors
    learn: colorScheme.categoryLearn,
    focus: colorScheme.categoryFocus,
    prod: colorScheme.categoryProductivity,
    study: colorScheme.categoryStudy,
    
    // Legacy compatibility mappings (deprecated)
    card: colorScheme.surfaceContainer,
    ink: colorScheme.onSurface,
    inkMid: colorScheme.onSurfaceVariant,
    inkDim: colorScheme.onSurfaceDisabled,
    border: mode === 'dark' 
      ? 'rgba(242,241,238,0.08)' 
      : 'rgba(13,13,13,0.07)',
    positivity: colorScheme.success,
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
