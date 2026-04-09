import { createWidget } from 'expo-widgets';
import { VStack, HStack, Text, Spacer } from '@expo/ui/swift-ui';
import { padding, background, foregroundStyle, font, cornerRadius, frame } from '@expo/ui/swift-ui/modifiers';
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
      modifiers={[
        padding({ all: 16 }),
        background('#0A0A0A'),
        cornerRadius(20),
      ]}
    >
      {/* Header */}
      <HStack>
        <Text
          modifiers={[
            font({ size: 12, weight: 'semibold' }),
            foregroundStyle('#888888'),
          ]}
        >
          PRODUCTIVE+
        </Text>
      </HStack>

      <Spacer />

      {/* Main Stats */}
      <VStack
        modifiers={[
          padding({ top: 4, bottom: 4 }),
        ]}
      >
        <Text
          modifiers={[
            font({ size: 32, weight: 'bold' }),
            foregroundStyle('#FFFFFF'),
          ]}
        >
          🔥 {weeklyStreak}
        </Text>
        <Text
          modifiers={[
            font({ size: 14, weight: 'medium' }),
            foregroundStyle('#6366F1'),
          ]}
        >
          {currentLevel}
        </Text>
      </VStack>

      <Spacer />

      {/* Progress Bar */}
      <VStack modifiers={[padding({ top: 6 })]}>
        <HStack>
          <Text modifiers={[font({ size: 10 }), foregroundStyle('#FFFFFF')]}>{weeklyScore} XP</Text>
          <Spacer />
          <Text modifiers={[font({ size: 10 }), foregroundStyle('#888888')]}>Goal: {xpGoal}</Text>
        </HStack>
        
        <HStack modifiers={[frame({ height: 6 }), background('#1A1A1A'), cornerRadius(3)]}>
          <HStack
            modifiers={[
              frame({ width: progressPercent, height: 6 }),
              background('#6366F1'),
              cornerRadius(3),
            ]}
          >
            <Spacer />
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
});
