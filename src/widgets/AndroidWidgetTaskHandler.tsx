import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { ProductiveAndroidWidget } from './ProductiveAndroidWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetName, widgetAction, widgetId, payload } = props;

  if (widgetAction === 'WIDGET_ADDED' || widgetAction === 'WIDGET_UPDATE') {
    // Get data from payload or defaults
    const data = {
      weeklyScore: payload?.weeklyScore ?? 0,
      weeklyStreak: payload?.weeklyStreak ?? 0,
      currentLevel: payload?.currentLevel ?? 'Beginner',
    };

    props.renderWidget(<ProductiveAndroidWidget {...data} />);
  }
}
