import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from './tokens';

export type Mode = 'light' | 'dark';

const ThemeContext = createContext({ mode: 'dark' as Mode, toggle: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((v) => { if (v) setMode(v as Mode); });
  }, []);

  const toggle = async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    await AsyncStorage.setItem('theme', next);
  };

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const { mode, toggle } = useContext(ThemeContext);
  const t = tokens;
  const isDark = mode === 'dark';
  
  return {
    mode, toggle, isDark,
    bg:      isDark ? t.colors.bgDark      : t.colors.bgLight,
    card:    isDark ? t.colors.cardDark    : t.colors.cardLight,
    ink:     isDark ? t.colors.inkDark     : t.colors.inkLight,
    inkMid:  isDark ? 'rgba(242,241,238,0.5)' : '#6B6B6B',
    inkDim:  isDark ? 'rgba(242,241,238,0.3)' : '#9A9A9A',
    learn:   isDark ? t.colors.learnDark   : t.colors.learnLight,
    focus:   isDark ? t.colors.focusDark   : t.colors.focusLight,
    prod:    isDark ? t.colors.prodDark    : t.colors.prodLight,
    study:   isDark ? t.colors.studyDark   : t.colors.studyLight,
    border:  isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.07)',
    positivity: t.colors.positivity
  };
};
