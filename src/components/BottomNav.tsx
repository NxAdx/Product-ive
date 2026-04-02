import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Home, Plus, BarChart3, Compass } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function BottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useTheme();

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
          onPress={() => navigation.navigate('index')}
          style={styles.navItem}
        >
          <Home 
            size={22} 
            color={getIsActive('index') ? t.ink : t.inkMid} 
            strokeWidth={getIsActive('index') ? 2.5 : 2}
          />
        </Pressable>

        {/* Center Add Button */}
        <Pressable 
          onPress={() => navigation.navigate('todo')}
          style={[
            styles.navCenter, 
            { backgroundColor: t.isDark ? t.ink : '#0D0D0D' }
          ]}
        >
          <View style={[
            styles.navCenterInner,
            { backgroundColor: t.isDark ? '#F2F1EE' : '#0D0D0D' }
          ]}>
            <Plus size={24} color={t.isDark ? '#0D0D0D' : '#FFFFFF'} strokeWidth={2.5} />
          </View>
        </Pressable>

        {/* Explore Tab */}
        <Pressable 
          onPress={() => navigation.navigate('explore')}
          style={styles.navItem}
        >
          <Compass 
            size={22} 
            color={getIsActive('explore') ? t.ink : t.inkMid}
            strokeWidth={getIsActive('explore') ? 2.5 : 2}
          />
        </Pressable>

        {/* Meter Tab */}
        <Pressable 
          onPress={() => navigation.navigate('meter')}
          style={styles.navItem}
        >
          <BarChart3 
            size={22} 
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
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 10,
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
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9999,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  navItem: {
    width: 44,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCenter: {
    marginHorizontal: 8,
    borderRadius: 9999,
  },
  navCenterInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
});
