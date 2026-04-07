import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, LayoutAnimation } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { useTodoStore } from '../../src/store/todoStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Trash2, Check, Target, Menu, ArrowDown, ClipboardList } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { tokens } from '../../src/theme/tokens';
import { ThemedText } from '../../src/components/ThemedText';
import { BentoCard } from '../../src/components/BentoCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { todos, addTodo, removeTodo, toggleTodo } = useTodoStore();

  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleAddTodo = async () => {
    if (newTitle.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      addTodo(newTitle.trim(), [], priority);
      setNewTitle('');
      setPriority('medium');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const activeTodos = todos.filter((x) => !x.completed);
  const completedTodos = todos.filter((x) => x.completed);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ 
            paddingTop: insets.top + tokens.spacing.md,
            paddingBottom: insets.bottom + 120,
            paddingHorizontal: tokens.spacing.padding 
          }}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText variant="h1">Commitments</ThemedText>
          <ThemedText variant="body" color={t.textSecondary}>What will you achieve today?</ThemedText>

          {/* Quick Add Section */}
          {/* Quick Add Section v4.4 */}
          <View style={styles.addSection}>
             <View style={[styles.inputCard, { backgroundColor: t.surfaceLow, borderColor: t.border }]}>
               <TextInput
                 placeholder="What is your next commitment?"
                 placeholderTextColor={t.textDisabled}
                 value={newTitle}
                 onChangeText={setNewTitle}
                 style={[styles.input, { color: t.text }]}
                 multiline={false}
                 maxLength={60}
               />
             </View>

             <View style={{ position: 'relative' }}>
               <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={{ marginTop: 12 }} 
                contentContainerStyle={{ gap: 8, paddingRight: 40 }}
               >
                  {['Study 30m', 'Drink water', 'Plan day', 'Focus cycle'].map((txt) => (
                    <Pressable 
                     key={txt} 
                     onPress={() => {
                         setNewTitle(txt);
                         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                     }}
                     style={{ 
                       paddingHorizontal: 12, 
                       paddingVertical: 6, 
                       borderRadius: 12, 
                       backgroundColor: t.surfaceHigh,
                       borderWidth: 1,
                       borderColor: t.border
                     }}
                     >
                      <ThemedText variant="caption" color={t.textSecondary}>{txt}</ThemedText>
                    </Pressable>
                  ))}
               </ScrollView>
               <LinearGradient
                  colors={['transparent', t.bg]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40 }}
                  pointerEvents="none"
                />
             </View>

            {/* Priority Bento Selector */}
            <View style={styles.priorityGrid}>
              <Pressable 
                onPress={() => setPriority('high')}
                style={({ pressed }) => [
                  styles.priorityCard, 
                  { 
                    backgroundColor: priority === 'high' ? t.positivity : t.surfaceLow,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.9 : 1
                  },
                  priority === 'high' && {
                    shadowColor: t.positivity,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8
                  }
                ]}
              >
                <Target size={18} color={priority === 'high' ? "#FFFFFF" : t.textDisabled} />
                <ThemedText variant="label" color={priority === 'high' ? "#FFFFFF" : t.textSecondary} style={{ marginTop: 8, fontWeight: '800' }}>
                  High
                </ThemedText>
              </Pressable>
              <Pressable 
                onPress={() => setPriority('medium')}
                style={({ pressed }) => [
                  styles.priorityCard, 
                  { 
                    backgroundColor: priority === 'medium' ? t.positivity : t.surfaceLow,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.9 : 1
                  },
                  priority === 'medium' && {
                    shadowColor: t.positivity,
                    offset: { width: 0, height: 4 },
                    opacity: 0.2,
                    radius: 10,
                    elevation: 6
                  }
                ]}
              >
                <Menu size={20} color={priority === 'medium' ? "#FFFFFF" : t.textDisabled} />
                <ThemedText variant="label" style={{ marginTop: 8, fontWeight: '800', color: priority === 'medium' ? "#FFFFFF" : t.textSecondary }}>
                  Medium
                </ThemedText>
              </Pressable>
              <Pressable 
                onPress={() => setPriority('low')}
                style={({ pressed }) => [
                  styles.priorityCard, 
                  { 
                    backgroundColor: priority === 'low' ? t.positivity : t.surfaceLow,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.9 : 1
                  },
                ]}
              >
                <ArrowDown size={18} color={priority === 'low' ? "#FFFFFF" : t.textDisabled} />
                <ThemedText variant="label" color={priority === 'low' ? "#FFFFFF" : t.textSecondary} style={{ marginTop: 8 }}>
                  Low
                </ThemedText>
              </Pressable>
            </View>

            <Pressable 
              onPress={handleAddTodo}
              disabled={!newTitle.trim()}
              style={({ pressed }) => [
                styles.primaryAddBtn, 
                { 
                  backgroundColor: newTitle.trim() ? t.positivity : (t.isDark ? 'rgba(255,255,255,0.05)' : '#E5E7EB'),
                  marginTop: 20,
                  transform: [{ scale: (pressed && newTitle.trim()) ? 0.96 : 1 }],
                  opacity: newTitle.trim() ? (pressed ? 0.8 : 1) : 0.35
                }
              ]}
            >
              <ThemedText 
                variant="label" 
                style={{ 
                  color: newTitle.trim() ? '#FFFFFF' : t.textDisabled, 
                  fontWeight: '900', 
                  fontSize: 13 
                }}
              >
                Add commitment
              </ThemedText>
              <Check 
                size={18} 
                color={newTitle.trim() ? '#FFFFFF' : t.textDisabled} 
                strokeWidth={3} 
                style={{ marginLeft: 8 }} 
              />
            </Pressable>
          </View>

          {/* Active Tasks */}
          {activeTodos.length > 0 ? (
            <View style={{ marginTop: 32 }}>
              <ThemedText variant="label" color={t.textDisabled} style={{ marginBottom: 16 }}>Active</ThemedText>
              {activeTodos.map((todo) => (
                <BentoCard 
                  key={todo.id} 
                  variant="default" 
                  padding={16} 
                  style={{ 
                    marginBottom: 12, 
                    backgroundColor: t.surfaceLow,
                    borderColor: todo.priority === 'high' ? t.positivity : 'transparent',
                    borderWidth: todo.priority === 'high' ? 1.5 : 1
                  }}
                >
                  <View style={styles.todoRow}>
                    <Pressable 
                      onPress={() => toggleTodo(todo.id)}
                      style={[
                        styles.checkbox, 
                        { 
                          borderColor: todo.priority === 'high' ? t.positivity : t.border,
                          backgroundColor: todo.completed ? t.positivity : 'transparent' 
                        }
                      ]}
                    >
                      {todo.completed && <Check size={14} color="#fff" strokeWidth={3} />}
                    </Pressable>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <ThemedText variant="h3" style={{ fontSize: 16 }}>{todo.title}</ThemedText>
                      <ThemedText variant="caption" color={t.textSecondary}>Priority: {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</ThemedText>
                    </View>
                    <Pressable onPress={() => removeTodo(todo.id)}>
                      <Trash2 size={18} color={t.textDisabled} />
                    </Pressable>
                  </View>
                </BentoCard>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconContainer, { backgroundColor: t.surfaceLow }]}>
                <ClipboardList size={40} color={t.textDisabled} strokeWidth={1} />
              </View>
              <ThemedText variant="h3" style={{ textAlign: 'center', marginTop: 20 }}>No commitments yet</ThemedText>
              <ThemedText variant="body" align="center" color={t.textSecondary} style={{ marginTop: 8 }}>
                Win your day with one small promise.
              </ThemedText>
            </View>
          )}

          {/* Completed Footer */}
          {completedTodos.length > 0 && (
            <View style={{ marginTop: 24, opacity: 0.6 }}>
               <ThemedText variant="label" color={t.textDisabled}>Completed ({completedTodos.length})</ThemedText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addSection: {
    marginTop: 32,
  },
  inputCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 80,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 18,
  },
  primaryAddBtn: {
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  priorityGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  priorityCard: {
    flex: 1,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
