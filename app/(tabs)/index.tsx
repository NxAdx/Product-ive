import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { CATEGORIES } from '../../src/data/categories';
import { CategoryCard } from '../../src/components/CategoryCard';
import { User, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={[styles.btn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)', borderColor: t.isDark ? 'rgba(242,241,238,0.06)' : 'rgba(13,13,13,0.08)' }]}>
          <User size={18} color={t.isDark ? t.ink : t.inkMid} strokeWidth={2} />
        </View>
        <Text style={[styles.title, { color: t.ink }]}>Product<Text style={{color: t.positivity, fontStyle:'italic'}}>+</Text>ive</Text>
        <View style={[styles.btn, { backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)', borderColor: t.isDark ? 'rgba(242,241,238,0.06)' : 'rgba(13,13,13,0.08)' }]}>
          <Settings size={18} color={t.isDark ? t.ink : t.inkMid} strokeWidth={2} />
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          <CategoryCard 
            category={CATEGORIES[0]} 
            onPress={() => router.push(`/category/${CATEGORIES[0].id}`)} 
          />
          <View style={{width: 12}} />
          <CategoryCard 
            category={CATEGORIES[1]} 
            onPress={() => router.push(`/category/${CATEGORIES[1].id}`)} 
          />
        </View>
        <View style={{height: 12}} />
        <View style={styles.row}>
          <CategoryCard 
            category={CATEGORIES[2]} 
            onPress={() => router.push(`/category/${CATEGORIES[2].id}`)} 
          />
          <View style={{width: 12}} />
          <CategoryCard 
            category={CATEGORIES[3]} 
            onPress={() => router.push(`/category/${CATEGORIES[3].id}`)} 
          />
        </View>
      </View>
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
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 20,
    letterSpacing: -0.01,
  },
  grid: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
  }
});
