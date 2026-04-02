import { Tabs } from 'expo-router';
import { BottomNav } from '../../src/components/BottomNav';
import { useTheme } from '../../src/theme/ThemeContext';

export default function TabLayout() {
  const { bg } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Let BottomNav handle display completely
        sceneStyle: { backgroundColor: bg }
      }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="meter" />
    </Tabs>
  );
}
