import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, FlatList } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { RULES } from '../../src/data/rules';
import { CATEGORIES } from '../../src/data/categories';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';

export default function ExploreScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const filteredRules = RULES.filter(rule =>
    rule.name.toLowerCase().includes(search.toLowerCase()) ||
    rule.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  const renderRuleRow = ({ item }: { item: typeof RULES[0] }) => {
    const category = CATEGORIES.find(c => c.id === item.categoryId);
    return (
      <Pressable
        onPress={() => router.push(`/rule/${item.id}`)}
        style={[styles.ruleRow, { backgroundColor: t.card, borderColor: t.border }]}
      >
        <View>
          <Text style={[styles.ruleName, { color: t.ink }]}>{item.name}</Text>
          <Text style={[styles.ruleDesc, { color: t.inkDim }]}>{item.shortDescription}</Text>
        </View>
        <Text style={{ fontSize: 18 }}>{category?.icon}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.ink }]}>Explore Rules</Text>
      </View>

      {/* Search Bar */}
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

      {/* Rules List */}
      <FlatList
        data={filteredRules}
        renderItem={renderRuleRow}
        keyExtractor={item => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🔍</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'DMSerifDisplay',
    letterSpacing: -0.01,
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
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: 'DMSans_400Regular',
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
    borderWidth: 1,
  },
  ruleName: {
    fontSize: 15,
    fontFamily: 'DMSans_700Bold',
    marginBottom: 4,
  },
  ruleDesc: {
    fontSize: 12,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'DMSans_600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
  }
});
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
