import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Home, Plus, BarChart3, Compass } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { logRuntimeEvent } from '../utils/runtimeLogs';

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useTheme();

  const activeRouteName = state.routes[state.index]?.name;
  if (activeRouteName !== 'index') {
    return null;
  }

  // Map route names to tab indices for active state
  const getIsActive = (routeName: string) => {
    const route = state.routes[state.index];
    return route?.name === routeName;
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.pill,
        {
          backgroundColor: t.isDark ? 'rgba(30,30,30,0.97)' : 'rgba(242,241,238,0.97)',
          borderColor: t.isDark ? 'rgba(242,241,238,0.06)' : 'transparent',
          borderWidth: t.isDark ? 1 : 0,
          shadowColor: t.isDark ? 'transparent' : '#0D0D0D',
        }
      ]}>
        
        {/* Home Tab */}
        <Pressable 
          onPress={() => {
            logRuntimeEvent('nav_tap', { to: 'index' }).catch(() => {});
            navigation.navigate('index');
          }}
          style={styles.navItem}
        >
          <Home 
            size={20} 
            color={getIsActive('index') ? t.ink : t.inkMid} 
            strokeWidth={getIsActive('index') ? 2.5 : 2}
          />
        </Pressable>

        {/* Center Add Button */}
        <Pressable 
          onPress={() => {
            logRuntimeEvent('nav_tap', { to: 'todo' }).catch(() => {});
            navigation.navigate('todo');
          }}
          style={styles.navItem}
        >
          <Plus
            size={20}
            color={getIsActive('todo') ? t.ink : t.inkMid}
            strokeWidth={getIsActive('todo') ? 2.5 : 2}
          />
        </Pressable>

        {/* Explore Tab */}
        <Pressable 
          onPress={() => {
            logRuntimeEvent('nav_tap', { to: 'explore' }).catch(() => {});
            navigation.navigate('explore');
          }}
          style={styles.navItem}
        >
          <Compass 
            size={20} 
            color={getIsActive('explore') ? t.ink : t.inkMid}
            strokeWidth={getIsActive('explore') ? 2.5 : 2}
          />
        </Pressable>

        {/* Meter Tab */}
        <Pressable 
          onPress={() => {
            logRuntimeEvent('nav_tap', { to: 'meter' }).catch(() => {});
            navigation.navigate('meter');
          }}
          style={styles.navItem}
        >
          <BarChart3 
            size={20} 
            color={getIsActive('meter') ? t.ink : t.inkMid}
            strokeWidth={getIsActive('meter') ? 2.5 : 2}
          />
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 236,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9999,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  navItem: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
