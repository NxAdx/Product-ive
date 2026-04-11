import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductiveAndroidWidget } from './ProductiveAndroidWidget';

const WIDGET_DATA_KEY = 'PRODUCTIVE_WIDGET_DATA';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, renderWidget } = props;

  if (widgetAction === 'WIDGET_ADDED' || widgetAction === 'WIDGET_UPDATE') {
    let data = {
      weeklyScore: 0,
      weeklyStreak: 0,
      currentLevel: 'Beginner',
    };

    try {
      const storedData = await AsyncStorage.getItem(WIDGET_DATA_KEY);
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } catch (e) {
      console.warn('Failed to load widget data from AsyncStorage', e);
    }

    renderWidget(<ProductiveAndroidWidget {...data} />);
  }
}
