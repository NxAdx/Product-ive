import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, SearchX } from 'lucide-react-native';

import { CategoryIcon } from '../../src/components/CategoryIcon';
import { CATEGORIES } from '../../src/data/categories';
import { RULES } from '../../src/data/rules';
import { useTheme } from '../../src/theme/ThemeContext';
import { logRuntimeEvent } from '../../src/utils/runtimeLogs';

export default function ExploreScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const filteredRules = RULES.filter(
    (rule) =>
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  const renderRuleRow = ({ item }: { item: (typeof RULES)[0] }) => {
    const category = CATEGORIES.find((c) => c.id === item.categoryId);
    return (
      <Pressable
        onPress={() => router.push(`/rule/${item.id}`)}
        style={[styles.ruleRow, { backgroundColor: t.card, borderColor: t.border }]}
      >
        <View style={styles.ruleTextWrap}>
          <Text numberOfLines={1} style={[styles.ruleName, { color: t.ink }]}>
            {item.name}
          </Text>
          <Text numberOfLines={2} style={[styles.ruleDesc, { color: t.inkDim }]}>
            {item.shortDescription}
          </Text>
        </View>
        {category ? <CategoryIcon iconKey={category.icon} color={t.inkMid} size={18} /> : null}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            logRuntimeEvent('explore_back_home').catch(() => {});
            router.navigate('/(tabs)');
          }}
          style={[
            styles.backBtn,
            {
              backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)',
              borderColor: t.border,
            },
          ]}
        >
          <ArrowLeft size={18} color={t.ink} strokeWidth={2} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]}>Explore Rules</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: t.card, borderColor: t.border }]}>
          <Search size={18} color={t.inkMid} />
          <TextInput
            placeholder="Search rules..."
            placeholderTextColor={t.inkDim}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: t.ink }]}
          />
        </View>
      </View>

      <FlatList
        data={filteredRules}
        renderItem={renderRuleRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <SearchX size={32} color={t.inkDim} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: t.inkMid }]}>No rules found</Text>
            <Text style={[styles.emptySubtext, { color: t.inkDim }]}>Try a different search</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Manrope_700Bold',
    letterSpacing: -0.02,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: 'Inter_400Regular',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  ruleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  ruleTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  ruleName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  ruleDesc: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
