import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { CategoryConfig } from '../data/categories';
import { RULES } from '../data/rules';
import { CategoryIcon } from './CategoryIcon';

interface CategoryCardProps {
  category: CategoryConfig;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const t = useTheme();
  const scale = useSharedValue(1);
  const iconRotation = useSharedValue(0);

  const rulesCount = RULES.filter(r => r.categoryId === category.id).length;

  // Background and colors depend on the theme
  const getAccentColors = () => {
    switch(category.tokenKey) {
      case 'learn': return { color: t.learn, bg: t.isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.15)' };
      case 'focus': return { color: t.focus, bg: t.isDark ? 'rgba(29,78,216,0.15)' : 'rgba(29,78,216,0.15)' };
      case 'prod':  return { color: t.prod,  bg: t.isDark ? 'rgba(5,150,105,0.15)' : 'rgba(5,150,105,0.15)' };
      case 'study': return { color: t.study, bg: t.isDark ? 'rgba(180,83,9,0.15)' : 'rgba(180,83,9,0.15)' };
    }
  };

  const accent = getAccentColors();
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    boxShadow: scale.value < 1 ? '0 1px 0 rgba(13,13,13,0.14), 0 2px 8px rgba(13,13,13,0.04)' 
                               : '0 2px 0 rgba(13,13,13,0.12), 0 8px 24px rgba(13,13,13,0.06)'
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value < 1 ? 1.05 : 1 },
      { rotate: `${iconRotation.value}deg` }
    ]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 200 });
    iconRotation.value = withSpring(-4);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    iconRotation.value = withSpring(0);
  };

  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={handlePressIn} 
      onPressOut={handlePressOut}
      style={{ flex: 1, aspectRatio: 1 }}
    >
      <Animated.View style={[
        styles.card, 
        { 
          backgroundColor: t.card,
          borderColor: t.border
        },
        animatedStyle
      ]}>
        <Animated.View style={[
          styles.iconContainer,
          { backgroundColor: accent.bg },
          iconStyle
        ]}>
          <CategoryIcon iconKey={category.icon} color={accent.color} size={20} />
        </Animated.View>
        <View style={styles.bottom}>
          <Text numberOfLines={2} style={[styles.name, { color: t.ink }]}>{category.name}</Text>
          <Text style={[styles.count, { color: t.inkDim }]}>{rulesCount} rules</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    marginTop: 8,
  },
  name: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 17,
    letterSpacing: -0.01,
    lineHeight: 21,
  },
  count: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 11,
    marginTop: 4,
  }
});
