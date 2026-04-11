import React from 'react';
import { Flex, Text, Box, ProgressBar } from 'react-native-android-widget';

export interface AndroidWidgetProps {
  weeklyScore: number;
  weeklyStreak: number;
  currentLevel: string;
}

export function ProductiveAndroidWidget({ weeklyScore, weeklyStreak, currentLevel }: AndroidWidgetProps) {
  const xpGoal = 500;
  const progressPercent = Math.min(100, (weeklyScore / xpGoal) * 100);

  return (
    <Flex
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0A0A0A',
        padding: 16,
        borderRadius: 20,
      }}
      flexDirection="column"
    >
      {/* Header */}
      <Flex flexDirection="row" style={{ width: 'match_parent' }}>
        <Text
          text="PRODUCTIVE+"
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: '#888888',
          }}
        />
      </Flex>

      {/* Main Stats */}
      <Flex flexDirection="column" style={{ marginTop: 12, marginBottom: 12 }}>
        <Text
          text={`🔥 ${weeklyStreak}`}
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#FFFFFF',
          }}
        />
        <Text
          text={currentLevel}
          style={{
            fontSize: 13,
            fontWeight: 'medium',
            color: '#6366F1',
          }}
        />
      </Flex>

      {/* Progress Section */}
      <Flex flexDirection="column" style={{ marginTop: 'auto' }}>
        <Flex flexDirection="row" style={{ width: 'match_parent', marginBottom: 4 }}>
          <Text
            text={`${weeklyScore} XP`}
            style={{ fontSize: 9, color: '#FFFFFF' }}
          />
          <Box style={{ flex: 1 }} />
          <Text
            text={`Goal: ${xpGoal}`}
            style={{ fontSize: 9, color: '#888888' }}
          />
        </Flex>

        <ProgressBar
          progress={progressPercent}
          style={{
            height: 6,
            width: 'match_parent',
            color: '#6366F1',
          }}
        />
      </Flex>
    </Flex>
  );
}
