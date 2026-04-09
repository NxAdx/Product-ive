import { createWidget, VStack, HStack, Text, Spacer } from 'expo-widgets';
import React from 'react';

/**
 * Productive+ Glance Widget
 * Displays Weekly XP and Daily Streak on the home screen.
 */
function ProductiveGlance({ props }) {
  'widget';

  const { weeklyScore = 0, weeklyStreak = 0, currentLevel = 'Beginner' } = props;
  const xpGoal = 500;
  const progress = Math.min(1, weeklyScore / xpGoal);

  return (
    <VStack
      cornerRadius={20}
      padding={16}
      background="#0A0A0A"
      alignment="leading"
    >
      {/* Header */}
      <HStack alignment="center" spacing={8}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#888888',
            textTransform: 'uppercase',
          }}
        >
          Productive+
        </Text>
      </HStack>

      <Spacer />

      {/* Main Stats */}
      <VStack alignment="leading" spacing={4}>
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
            color: '#6366F1', // Indigo accent
          }}
        >
          {currentLevel}
        </Text>
      </VStack>

      <Spacer />

      {/* Progress Bar */}
      <VStack spacing={6}>
        <HStack>
          <Text style={{ fontSize: 10, color: '#FFFFFF' }}>{weeklyScore} XP</Text>
          <Spacer />
          <Text style={{ fontSize: 10, color: '#888888' }}>Goal: {xpGoal}</Text>
        </HStack>
        
        {/* Simple Progress Implementation using HStack */}
        <HStack height={6} background="#1A1A1A" cornerRadius={3}>
          <HStack
            width={progress * 100 + '%'}
            height={6}
            background="#6366F1"
            cornerRadius={3}
          />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default createWidget('ProductiveGlance', ProductiveGlance);
