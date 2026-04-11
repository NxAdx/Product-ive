import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface AndroidWidgetProps {
  weeklyScore: number;
  weeklyStreak: number;
  currentLevel: string;
}

export function ProductiveAndroidWidget({ weeklyScore, weeklyStreak, currentLevel }: AndroidWidgetProps) {
  const xpGoal = 500;
  
  // Weights for the progress bar (RemoteViews does not support % width easily)
  const progressWeight = Math.max(0.001, Math.min(weeklyScore, xpGoal));
  const remainingWeight = Math.max(0.001, xpGoal - progressWeight);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#0A0A0A',
        padding: 16,
        borderRadius: 20,
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row' }}>
        <TextWidget
          text="PRODUCTIVE+"
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: '#888888',
          }}
        />
      </FlexWidget>

      {/* Main Stats */}
      <FlexWidget style={{ marginTop: 12, marginBottom: 12, flexDirection: 'column', flex: 1 }}>
        <TextWidget
          text={`🔥 ${weeklyStreak}`}
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#FFFFFF',
          }}
        />
        <TextWidget
          text={currentLevel}
          style={{
            fontSize: 13,
            fontWeight: 'normal',
            color: '#6366F1',
          }}
        />
      </FlexWidget>

      {/* Progress Section */}
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'column' }}>
        <FlexWidget style={{ width: 'match_parent', marginBottom: 4, flexDirection: 'row' }}>
          <TextWidget
            text={`${weeklyScore} XP`}
            style={{ fontSize: 9, color: '#FFFFFF' }}
          />
          <FlexWidget style={{ flex: 1 }} />
          <TextWidget
            text={`Goal: ${xpGoal}`}
            style={{ fontSize: 9, color: '#888888' }}
          />
        </FlexWidget>

        {/* Weighted Flex Progress Bar */}
        <FlexWidget
          style={{
            height: 6,
            width: 'match_parent',
            backgroundColor: '#1A1A1A',
            borderRadius: 3,
            flexDirection: 'row',
          }}
        >
          <FlexWidget
            style={{
              height: 6,
              flex: progressWeight,
              backgroundColor: '#6366F1',
              borderRadius: 3,
            }}
          />
          <FlexWidget
            style={{
              height: 6,
              flex: remainingWeight,
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
