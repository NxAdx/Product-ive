import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductiveAndroidWidget } from './ProductiveAndroidWidget';

const WIDGET_DATA_KEY = 'PRODUCTIVE_WIDGET_DATA';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, renderWidget } = props;

  // Logging for adb logcat visibility
  console.log(`[ProductiveWidget] Action: ${widgetAction}`);

  if (widgetAction === 'WIDGET_ADDED' || widgetAction === 'WIDGET_UPDATE' || widgetAction === 'WIDGET_RESIZED') {
    let data = {
      weeklyScore: 0,
      weeklyStreak: 0,
      currentLevel: 'Beginner',
    };

    try {
      const storedData = await AsyncStorage.getItem(WIDGET_DATA_KEY);
      console.log(`[ProductiveWidget] Stored Data: ${storedData}`);
      
      if (storedData) {
        const parsed = JSON.parse(storedData);
        data = {
          weeklyScore: typeof parsed.weeklyScore === 'number' ? parsed.weeklyScore : 0,
          weeklyStreak: typeof parsed.weeklyStreak === 'number' ? parsed.weeklyStreak : 0,
          currentLevel: parsed.currentLevel || 'Beginner',
        };
      }
    } catch (e) {
      console.warn('[ProductiveWidget] Storage Retrieval Failed:', e);
    }

    renderWidget(<ProductiveAndroidWidget {...data} />);
  }
}
