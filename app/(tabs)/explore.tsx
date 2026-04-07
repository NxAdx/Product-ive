import React, { useState } from 'react';
import { Pressable, StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SearchX, ChevronRight } from 'lucide-react-native';
import { CATEGORIES } from '../../src/data/categories';
import { RULES } from '../../src/data/rules';
import { useTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import { ThemedText } from '../../src/components/ThemedText';
import { BentoCard } from '../../src/components/BentoCard';
import { CategoryIcon } from '../../src/components/CategoryIcon';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExploreScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRules = RULES.filter(
    (rule) => {
      const matchesSearch = rule.name.toLowerCase().includes(search.toLowerCase()) ||
                            rule.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? rule.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    }
  );

  const renderRuleCard = ({ item }: { item: (typeof RULES)[0] }) => {
    const category = CATEGORIES.find((c) => c.id === item.categoryId);
    const accentColor = category ? (t as any)[category.tokenKey] : t.positivity;

    return (
      <BentoCard 
        variant="default" 
        padding={16} 
        style={{ 
          marginBottom: 12, 
          backgroundColor: t.surfaceLow,
          borderLeftWidth: 4,
          borderLeftColor: accentColor 
        }}
        onPress={() => router.push(`/rule/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: t.isDark ? `${accentColor}1A` : `${accentColor}25` }]}>
             <CategoryIcon iconKey={category?.icon || 'zap'} color={accentColor} size={16} />
          </View>
          <View style={styles.cardBody}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedText variant="h3" style={{ fontSize: 16 }}>{item.name}</ThemedText>
              <View style={styles.metaBadge}>
                <ThemedText variant="caption" style={{ fontSize: 10, color: t.textDisabled }}>⏱ 25 min • Easy</ThemedText>
              </View>
            </View>
            <ThemedText variant="caption" color={t.textSecondary} numberOfLines={2} style={{ marginTop: 2 }}>
              {item.shortDescription}
            </ThemedText>
          </View>
          <ChevronRight size={16} color={t.textDisabled} />
        </View>
      </BentoCard>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.paddingX}>
        <ThemedText variant="h1">Explore</ThemedText>
        <ThemedText variant="body" color={t.textSecondary}>Discover your next ritual</ThemedText>
      </View>

      {/* Search Bar */}
      <View style={[styles.paddingX, { marginTop: 24 }]}>
        <View style={[styles.searchBar, { backgroundColor: t.surfaceLow, borderColor: t.border }]}>
          <Search size={18} color={t.textDisabled} />
          <TextInput
            placeholder="Search rules..."
            placeholderTextColor={t.textDisabled}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: t.text }]}
          />
        </View>
      </View>

      {/* Categories Carousel */}
      <View style={{ position: 'relative' }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <Pressable 
            onPress={() => setSelectedCategory(null)}
            style={({ pressed }) => [
              styles.categoryPill, 
              { 
                backgroundColor: !selectedCategory ? t.text : t.surfaceLow,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <ThemedText 
              variant="label" 
              color={!selectedCategory ? t.bg : t.textSecondary}
            >
              All
            </ThemedText>
          </Pressable>
          {CATEGORIES.map((cat) => (
            <Pressable 
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={({ pressed }) => [
                styles.categoryPill, 
                { 
                  backgroundColor: selectedCategory === cat.id ? t.text : t.surfaceLow,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <ThemedText 
                variant="label" 
                color={selectedCategory === cat.id ? t.bg : t.textSecondary}
              >
                {cat.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
        <LinearGradient
          colors={['transparent', t.bg]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fadeHint}
          pointerEvents="none"
        />
      </View>
    </View>
  );

  const popularRules = filteredRules.slice(0, 3);
  const popularIds = new Set(popularRules.map(r => r.id));

  const groupedCategories = [
    { title: '🔥 Popular', data: popularRules },
    { title: '⚡ Quick Wins', data: filteredRules.filter(r => !popularIds.has(r.id) && r.categoryId === 'productivity') },
    { title: '🧠 Deep Work', data: filteredRules.filter(r => !popularIds.has(r.id) && (r.categoryId === 'learning' || r.categoryId === 'focus')) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent, 
          { paddingTop: insets.top + tokens.spacing.md }
        ]}
      >
        {renderHeader()}
        
        {groupedCategories.map((section) => (
          section.data.length > 0 && (
            <View key={section.title} style={{ marginTop: 24 }}>
              <ThemedText variant="label" color={t.textDisabled} style={{ marginBottom: 12, letterSpacing: 1 }}>{section.title.toUpperCase()}</ThemedText>
              {section.data.map(item => (
                <View key={item.id}>
                  {renderRuleCard({ item })}
                </View>
              ))}
            </View>
          )
        ))}

        {filteredRules.length === 0 && (
          <View style={styles.empty}>
            <SearchX size={32} color={t.textDisabled} style={{ marginBottom: 12 }} />
            <ThemedText variant="h3">No rituals found</ThemedText>
            <ThemedText variant="caption" color={t.textDisabled}>Try adjusting your filters</ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingBottom: 8,
  },
  paddingX: {
    paddingHorizontal: tokens.spacing.padding,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
  },
  categoryScroll: {
    paddingHorizontal: tokens.spacing.padding,
    paddingVertical: 20,
    gap: 8,
  },
  fadeHint: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listContent: {
    paddingHorizontal: tokens.spacing.padding,
    paddingBottom: 160,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
});
