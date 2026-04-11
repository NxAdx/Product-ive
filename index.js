import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './src/widgets/AndroidWidgetTaskHandler';
import 'expo-router/entry';

registerWidgetTaskHandler(widgetTaskHandler);
