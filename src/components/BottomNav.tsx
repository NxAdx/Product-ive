import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Home, Plus, BarChart3, Compass } from 'lucide-react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '../theme/ThemeContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { logRuntimeEvent } from '../utils/runtimeLogs';
import * as Haptics from 'expo-haptics';

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useTheme();

  // Map route names to tab indices for active state
  const getIsActive = (routeName: string) => {
    const route = state.routes[state.index];
    return route?.name === routeName;
  };

  const handlePress = (routeName: string) => {
    const isActive = getIsActive(routeName);
    if (!isActive) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      logRuntimeEvent('nav_tap', { to: routeName }).catch(() => {});
      navigation.navigate(routeName);
    }
  };

  // BottomNav logic (v4.0 Zero Distraction) 
  // Note: expo-router might use different internal names for stack routes
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.pill,
        {
          backgroundColor: t.isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.9)',
          borderColor: t.border,
          borderWidth: 1,
        }
      ]}>
        
        {/* Home Tab */}
        <Pressable 
          onPress={() => handlePress('index')}
          style={styles.navItem}
        >
          <Home 
            size={20} 
            color={getIsActive('index') ? t.progress : t.textDisabled} 
            strokeWidth={getIsActive('index') ? 2.5 : 2}
          />
          <ThemedText 
            variant="label" 
            color={getIsActive('index') ? t.progress : t.textDisabled}
            style={{ fontSize: 10, marginTop: 4, textTransform: 'none' }}
          >
            Home
          </ThemedText>
        </Pressable>

        {/* Add Tab (Prominent) */}
        <Pressable 
          onPress={() => handlePress('add')}
          style={styles.navItem}
        >
          <Plus
            size={22}
            color={getIsActive('add') ? t.text : t.textDisabled}
            strokeWidth={getIsActive('add') ? 3 : 2}
          />
          <ThemedText 
            variant="label" 
            color={getIsActive('add') ? t.text : t.textDisabled}
            style={{ fontSize: 10, marginTop: 4, textTransform: 'none' }}
          >
            Add
          </ThemedText>
        </Pressable>

        {/* Explore Tab */}
        <Pressable 
          onPress={() => handlePress('explore')}
          style={styles.navItem}
        >
          <Compass 
            size={20} 
            color={getIsActive('explore') ? t.learning : t.textDisabled}
            strokeWidth={getIsActive('explore') ? 2.5 : 2}
          />
          <ThemedText 
            variant="label" 
            color={getIsActive('explore') ? t.learning : t.textDisabled}
            style={{ fontSize: 10, marginTop: 4, textTransform: 'none' }}
          >
            Explore
          </ThemedText>
        </Pressable>

        {/* Stats Tab */}
        <Pressable 
          onPress={() => handlePress('stats')}
          style={styles.navItem}
        >
          <BarChart3 
            size={20} 
            color={getIsActive('stats') ? t.memory : t.textDisabled}
            strokeWidth={getIsActive('stats') ? 2.5 : 2}
          />
          <ThemedText 
            variant="label" 
            color={getIsActive('stats') ? t.memory : t.textDisabled}
            style={{ fontSize: 10, marginTop: 4, textTransform: 'none' }}
          >
            Stats
          </ThemedText>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
    width: 280,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }
    }),
  },
  navItem: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
