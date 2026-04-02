import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { RuleConfig } from '../data/rules';
import { ArrowRight } from 'lucide-react-native';

interface RuleRowProps {
  rule: RuleConfig;
  onPress: () => void;
}

export function RuleRow({ rule, onPress }: RuleRowProps) {
  const t = useTheme();
  
  // Theme specifics
  const getDotColor = () => {
    switch (rule.categoryId) {
      case 'learning': return t.learn;
      case 'focus': return t.focus;
      case 'productivity': return t.prod;
      case 'study': return t.study;
    }
  };

  const dotColor = getDotColor();
  const tx = useSharedValue(0);
  const scale = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { scale: scale.value }
    ]
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
    tx.value = withSpring(0);
  };

  return (
    <Pressable 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[
        styles.container, 
        { 
          backgroundColor: t.card,
          borderColor: t.border
        },
        containerStyle
      ]}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: t.ink }]}>{rule.name}</Text>
          <Text style={[styles.desc, { color: t.inkMid }]} numberOfLines={1}>{rule.shortDescription}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <ArrowRight size={18} color={t.inkMid} strokeWidth={2} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 1,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    lineHeight: 19,
  },
  desc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    marginTop: 3,
  },
  arrowContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
