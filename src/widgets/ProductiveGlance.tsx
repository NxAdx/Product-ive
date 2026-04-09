import { createWidget } from 'expo-widgets';
import { VStack, HStack, Text, Spacer } from '@expo/ui/swift-ui';
import React from 'react';

export interface WidgetProps {
  weeklyScore: number;
  weeklyStreak: number;
  currentLevel: string;
}

/**
 * Productive+ Glance Widget
 */
export const ProductiveGlance = createWidget('ProductiveGlance', (props: WidgetProps) => {
  const { weeklyScore = 0, weeklyStreak = 0, currentLevel = 'Beginner' } = props;
  const xpGoal = 500;
  const progressPercent = Math.min(100, Math.floor((weeklyScore / xpGoal) * 100));

  return (
    <VStack
      style={{
        flex: 1,
        borderRadius: 20,
        padding: 16,
        backgroundColor: '#0A0A0A',
      }}
    >
      {/* Header */}
      <HStack style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#888888',
          }}
        >
          PRODUCTIVE+
        </Text>
      </HStack>

      <Spacer />

      {/* Main Stats */}
      <VStack style={{ gap: 4 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#FFFFFF',
          }}
        >
          🔥 {weeklyStreak}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: '#6366F1',
          }}
        >
          {currentLevel}
        </Text>
      </VStack>

      <Spacer />

      {/* Progress Bar */}
      <VStack style={{ gap: 6 }}>
        <HStack style={{ justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10, color: '#FFFFFF' }}>{weeklyScore} XP</Text>
          <Text style={{ fontSize: 10, color: '#888888' }}>Goal: {xpGoal}</Text>
        </HStack>
        
        <HStack style={{ height: 6, backgroundColor: '#1A1A1A', borderRadius: 3 }}>
          <HStack
            style={{
              width: `${progressPercent}%`,
              height: 6,
              backgroundColor: '#6366F1',
              borderRadius: 3,
            }}
          />
        </HStack>
      </VStack>
    </VStack>
  );
});
