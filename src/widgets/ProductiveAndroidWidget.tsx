'use no memo';

import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface AndroidWidgetProps {
  weeklyScore: number;
  weeklyStreak: number;
  currentLevel: string;
}

export function ProductiveAndroidWidget({
  weeklyScore,
  weeklyStreak,
  currentLevel,
}: AndroidWidgetProps) {
  const safeScore = Number.isFinite(weeklyScore) ? weeklyScore : 0;
  const safeStreak = Number.isFinite(weeklyStreak) ? weeklyStreak : 0;
  const safeLevel = currentLevel || 'Active';
  const xpGoal = 500;

  // RemoteViews cannot express percentage widths directly, so use flex weights.
  const progressWeight = Math.max(0.1, Math.min(safeScore, xpGoal));
  const remainingWeight = Math.max(0.1, xpGoal - progressWeight);

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

      <FlexWidget style={{ marginTop: 12, marginBottom: 12, flexDirection: 'column', flex: 1 }}>
        <TextWidget
          text={`Streak ${safeStreak}`}
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#FFFFFF',
          }}
        />
        <TextWidget
          text={safeLevel}
          style={{
            fontSize: 13,
            fontWeight: 'normal',
            color: '#6366F1',
          }}
        />
      </FlexWidget>

      <FlexWidget style={{ width: 'match_parent', flexDirection: 'column' }}>
        <FlexWidget style={{ width: 'match_parent', marginBottom: 4, flexDirection: 'row' }}>
          <TextWidget
            text={`${safeScore} XP`}
            style={{ fontSize: 9, color: '#FFFFFF' }}
          />
          <FlexWidget style={{ flex: 1 }} />
          <TextWidget
            text={`Goal: ${xpGoal}`}
            style={{ fontSize: 9, color: '#888888' }}
          />
        </FlexWidget>

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
