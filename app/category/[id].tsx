import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { CATEGORIES } from '../../src/data/categories';
import { getRulesByCategory } from '../../src/data/rules';
import { RuleRow } from '../../src/components/RuleRow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { CategoryIcon } from '../../src/components/CategoryIcon';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const category = CATEGORIES.find(c => c.id === id);
  if (!category) return null;

  const rules = getRulesByCategory(category.id);

  const getAccentColor = () => {
    switch (category.tokenKey) {
      case 'learn': return t.learn;
      case 'focus': return t.focus;
      case 'prod':  return t.prod;
      case 'study': return t.study;
    }
  };
  const accentColor = getAccentColor();

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.btn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)' }]}
        >
          <ArrowLeft size={18} color={t.isDark ? t.ink : t.ink} strokeWidth={2} />
        </Pressable>
        <View style={styles.titleWrap}>
          <CategoryIcon iconKey={category.icon} color={accentColor} size={18} />
          <Text numberOfLines={1} style={[styles.title, { color: t.ink }]}>
            {category.name}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${accentColor}1A`, borderColor: `${accentColor}33` }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>{rules.length} rules</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {rules.map(rule => (
          <RuleRow 
            key={rule.id} 
            rule={rule} 
            onPress={() => router.push(`/rule/${rule.id}`)} 
          />
        ))}
      </ScrollView>
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
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100, // accommodate default bottom padding if any
  }
});
