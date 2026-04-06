import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { getRuleById } from '../../src/data/rules';
import { CATEGORIES } from '../../src/data/categories';
import { ThemedText } from '../../src/components/ThemedText';
import { BentoCard } from '../../src/components/BentoCard';
import { CountdownEngine } from '../../src/engines/CountdownEngine';
import { IntervalReminderEngine } from '../../src/engines/IntervalReminderEngine';
import { GuidedPromptEngine } from '../../src/engines/GuidedPromptEngine';
import { SmartTaskSorterEngine } from '../../src/engines/SmartTaskSorterEngine';
import { SpacedRepetitionEngine } from '../../src/engines/SpacedRepetitionEngine';
import { AwarenessReflectionEngine } from '../../src/engines/AwarenessReflectionEngine';
import { FreeWriteRecallEngine } from '../../src/engines/FreeWriteRecallEngine';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, Share2, Bookmark, Lightbulb, GraduationCap } from 'lucide-react-native';
import { tokens } from '../../src/theme/tokens';

export default function RuleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [isActive, setIsActive] = useState(false);
  
  const rule = getRuleById(String(id || ''));
  if (!rule) {
    return (
      <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <ThemedText>Rule not found.</ThemedText>
      </View>
    );
  }

  const category = CATEGORIES.find(c => c.id === rule.categoryId);
  const accentColor = category ? (t as any)[category.tokenKey] : t.positivity;

  const renderEngine = () => {
    switch (rule.engine) {
      case 'countdown': return <CountdownEngine rule={rule} color={accentColor} />;
      case 'interval': return <IntervalReminderEngine rule={rule} color={accentColor} />;
      case 'guided': return <GuidedPromptEngine rule={rule} color={accentColor} />;
      case 'sorter': return <SmartTaskSorterEngine rule={rule} color={accentColor} />;
      case 'spaced': return <SpacedRepetitionEngine rule={rule} color={accentColor} />;
      case 'awareness': return <AwarenessReflectionEngine rule={rule} color={accentColor} />;
      case 'freewrite': return <FreeWriteRecallEngine rule={rule} color={accentColor} />;
      default: return <ThemedText>Engine not implemented.</ThemedText>;
    }
  };

  if (isActive) {
    return (
      <View style={[styles.activeContainer, { backgroundColor: t.bg, paddingTop: insets.top }]}>
        <View style={styles.activeHeader}>
          <Pressable onPress={() => setIsActive(false)} style={styles.backBtn}>
            <ArrowLeft size={24} color={t.text} />
          </Pressable>
          <ThemedText variant="h3" style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>{rule.name}</ThemedText>
        </View>
        <View style={{ flex: 1 }}>{renderEngine()}</View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView 
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={t.text} />
          </Pressable>
          <View style={styles.secondaryActions}>
            <Pressable style={styles.actionBtn}>
              <Bookmark size={20} color={t.textSecondary} />
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Share2 size={20} color={t.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.paddingX}>
          <ThemedText variant="label" color={accentColor} style={{ marginBottom: 8 }}>
            {category?.name} Ritual
          </ThemedText>
          <ThemedText variant="h1">{rule.name}</ThemedText>
          <ThemedText variant="bodyLg" color={t.textSecondary} style={{ marginTop: 12 }}>
            {rule.shortDescription}
          </ThemedText>
        </View>

        {/* Why it Matters (Bento) */}
        <View style={[styles.paddingX, { marginTop: 32 }]}>
          <BentoCard variant="default" padding={20} style={{ backgroundColor: t.surfaceLowest }}>
            <View style={styles.rowAlign}>
              <Lightbulb size={20} color={t.warning} />
              <ThemedText variant="label" color={t.warning} style={{ marginLeft: 8, flex: 1 }}>The Philosophy</ThemedText>
            </View>
            <ThemedText variant="body" style={{ marginTop: 12 }}>{rule.whyItWorks}</ThemedText>
          </BentoCard>
        </View>

        {/* How to Apply */}
        <View style={[styles.paddingX, { marginTop: 24 }]}>
          <View style={styles.rowAlign}>
            <GraduationCap size={20} color={t.info} />
            <ThemedText variant="label" color={t.info} style={{ marginLeft: 8 }}>How to apply</ThemedText>
          </View>
          <ThemedText variant="body" color={t.textSecondary} style={{ marginTop: 12, lineHeight: 24 }}>
            {rule.description}
          </ThemedText>
        </View>

        {/* Action Gap */}
        <View style={{ height: tokens.spacing.xxl }} />

        {/* Start Button */}
        <View style={styles.paddingX}>
          <Pressable 
            onPress={() => setIsActive(true)}
            onPressIn={() => {}} // Placeholder for future haptics
            style={({ pressed }) => [
              styles.startBtn, 
              { 
                backgroundColor: t.positivity,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <ThemedText variant="h3" style={{ color: '#000', fontWeight: '800', letterSpacing: 0.5 }}>START SESSION</ThemedText>
            <ChevronRight size={20} color="#000" strokeWidth={3} style={{ marginLeft: 12 }} />
          </Pressable>
          <Pressable 
            onPress={() => setIsActive(true)}
            style={[styles.quickModeBtn, { borderColor: t.border }]}
          >
            <ThemedText variant="label" color={t.textSecondary} style={{ letterSpacing: 1 }}>Try now (Quick mode)</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  activeContainer: { flex: 1 },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paddingX: {
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startBtn: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  quickModeBtn: {
    marginTop: 24,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  }
});
