import React from 'react';
import { Pressable, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { CATEGORIES } from '../../src/data/categories';
import { CategoryCard } from '../../src/components/CategoryCard';
import { StatsCard } from '../../src/components/StatsCard';
import { DailyTip } from '../../src/components/DailyTip';
import { ProgressBar } from '../../src/components/ProgressBar';
import { SessionStatusBadge } from '../../src/components/SessionStatusBadge';
import { SmartRuleRecommendations } from '../../src/components/SmartRuleRecommendations';
import { Settings2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { logRuntimeEvent } from '../../src/utils/runtimeLogs';

export default function Home() {
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.btnPlaceholder} />
        <Text style={[styles.title, { color: t.ink }]}>
          Product <Text style={{ color: t.positivity }}>+ive</Text>
        </Text>
        <Pressable
          onPress={() => {
            logRuntimeEvent('home_open_settings').catch(() => {});
            router.push('/settings' as any);
          }}
          style={[
            styles.btn,
            {
              backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)',
              borderColor: t.border,
            },
          ]}
        >
          <Settings2 size={18} color={t.ink} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Active Session Indicator */}
        <SessionStatusBadge />

        {/* Tier 1 Features */}
        <StatsCard />
        <DailyTip />
        <ProgressBar />

        {/* Tier 2: Smart Recommendations */}
        <SmartRuleRecommendations />

        {/* Category Grid */}
        <Text style={[styles.sectionTitle, { color: t.inkDim }]}>Explore Categories</Text>
        <View style={styles.grid}>
          <View style={styles.row}>
            <CategoryCard
              category={CATEGORIES[0]}
              onPress={() => router.push(`/category/${CATEGORIES[0].id}`)}
            />
            <View style={{ width: 12 }} />
            <CategoryCard
              category={CATEGORIES[1]}
              onPress={() => router.push(`/category/${CATEGORIES[1].id}`)}
            />
          </View>
          <View style={{ height: 12 }} />
          <View style={styles.row}>
            <CategoryCard
              category={CATEGORIES[2]}
              onPress={() => router.push(`/category/${CATEGORIES[2].id}`)}
            />
            <View style={{ width: 12 }} />
            <CategoryCard
              category={CATEGORIES[3]}
              onPress={() => router.push(`/category/${CATEGORIES[3].id}`)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    borderWidth: 1,
  },
  btnPlaceholder: {
    width: 36,
    height: 36,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 22,
    letterSpacing: -0.01,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  grid: {
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  row: {
    flexDirection: 'row',
  }
});
