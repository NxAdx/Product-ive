import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { getRuleById } from '../../src/data/rules';
import { CATEGORIES } from '../../src/data/categories';
import { CountdownEngine } from '../../src/engines/CountdownEngine';
import { IntervalReminderEngine } from '../../src/engines/IntervalReminderEngine';
import { GuidedPromptEngine } from '../../src/engines/GuidedPromptEngine';
import { SmartTaskSorterEngine } from '../../src/engines/SmartTaskSorterEngine';
import { SpacedRepetitionEngine } from '../../src/engines/SpacedRepetitionEngine';
import { AwarenessReflectionEngine } from '../../src/engines/AwarenessReflectionEngine';
import { FreeWriteRecallEngine } from '../../src/engines/FreeWriteRecallEngine';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Info } from 'lucide-react-native';

export default function RuleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  
  const rule = getRuleById(id as string);
  const category = CATEGORIES.find(c => c.id === rule.categoryId);

  const getAccentColor = () => {
    if (!category) return t.ink;
    switch (category.tokenKey) {
      case 'learn': return t.learn;
      case 'focus': return t.focus;
      case 'prod':  return t.prod;
      case 'study': return t.study;
    }
  };
  const accentColor = getAccentColor();

  const renderEngine = () => {
    switch (rule.engine) {
      case 'countdown': 
        return <CountdownEngine rule={rule} color={accentColor} />;
      case 'interval': 
        return <IntervalReminderEngine rule={rule} color={accentColor} />;
      case 'guided': 
        return <GuidedPromptEngine rule={rule} color={accentColor} />;
      case 'sorter': 
        return <SmartTaskSorterEngine rule={rule} color={accentColor} />;
      case 'spaced': 
        return <SpacedRepetitionEngine rule={rule} color={accentColor} />;
      case 'awareness': 
        return <AwarenessReflectionEngine rule={rule} color={accentColor} />;
      case 'freewrite': 
        return <FreeWriteRecallEngine rule={rule} color={accentColor} />;
      default: 
        return (
          <View style={styles.placeholder}>
            <Text style={{color: t.inkMid}}>
              Engine &apos;{rule.engine}&apos; not yet implemented for {rule.name}.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <View 
          onTouchEnd={() => router.back()}
          style={[styles.btn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)' }]}
        >
          <ArrowLeft size={18} color={t.isDark ? t.ink : t.ink} strokeWidth={2} />
        </View>
        <Text style={[styles.title, { color: t.ink }]}>{rule.name}</Text>
        <View 
          onTouchEnd={() => {/* TODO: Open Info Sheet */}}
          style={[styles.btn, { backgroundColor: 'transparent' }]}
        >
          <Info size={18} color={t.inkMid} strokeWidth={2} />
        </View>
      </View>

      <View style={styles.engineContainer}>
        {renderEngine()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 16,
  },
  engineContainer: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  }
});
