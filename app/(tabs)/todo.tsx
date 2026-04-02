import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { useTodoStore } from '../../src/store/todoStore';
import { RULES } from '../../src/data/rules';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, NotebookPen, Plus, Trash2 } from 'lucide-react-native';
import { logRuntimeEvent } from '../../src/utils/runtimeLogs';

export default function TodoScreen() {
  const router = useRouter();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const todos = useTodoStore((s) => s.todos);
  const addTodo = useTodoStore((s) => s.addTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  const [newTitle, setNewTitle] = useState('');
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleAddTodo = () => {
    if (newTitle.trim()) {
      addTodo(newTitle, selectedRules, priority);
      setNewTitle('');
      setSelectedRules([]);
      setPriority('medium');
    }
  };

  const activeTodos = todos.filter((x) => !x.completed);
  const completedTodos = todos.filter((x) => x.completed);
  const frogTask = activeTodos.find((x) => x.priority === 'high');

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            logRuntimeEvent('todo_back_home').catch(() => {});
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

        <Text style={[styles.title, { color: t.ink }]}>Tasks</Text>
        <Text style={[styles.subtitle, { color: t.inkMid }]}>{activeTodos.length} active</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {frogTask && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.positivity }]}>Priority Task</Text>
            <Pressable
              onPress={() => toggleTodo(frogTask.id)}
              style={[styles.todoItem, { backgroundColor: t.card, borderColor: t.positivity }]}
            >
              <View style={styles.todoContent}>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: t.positivity, backgroundColor: frogTask.completed ? t.positivity : 'transparent' },
                  ]}
                >
                  {frogTask.completed && <Check size={14} color={t.isDark ? t.bg : '#FFF'} strokeWidth={3} />}
                </View>
                <Text
                  style={[
                    styles.todoText,
                    { color: t.ink, textDecorationLine: frogTask.completed ? 'line-through' : 'none' },
                  ]}
                >
                  {frogTask.title}
                </Text>
              </View>
              <Pressable onPress={() => removeTodo(frogTask.id)}>
                <Trash2 size={16} color={t.inkDim} />
              </Pressable>
            </Pressable>
          </View>
        )}

        {activeTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.ink }]}>Active Tasks</Text>
            {activeTodos
              .filter((x) => x.id !== frogTask?.id)
              .map((todo) => (
                <Pressable
                  key={todo.id}
                  onPress={() => toggleTodo(todo.id)}
                  style={[styles.todoItem, { backgroundColor: t.card, borderColor: t.border }]}
                >
                  <View style={styles.todoContent}>
                    <View style={[styles.checkbox, { borderColor: t.inkDim }]}>
                      {todo.completed && <Check size={14} color={t.ink} strokeWidth={3} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.todoText,
                          { color: t.ink, textDecorationLine: todo.completed ? 'line-through' : 'none' },
                        ]}
                      >
                        {todo.title}
                      </Text>
                      {todo.ruleIds.length > 0 && (
                        <Text style={[styles.ruleTag, { color: t.inkDim }]}>
                          {RULES.find((r) => r.id === todo.ruleIds[0])?.name || 'Rule'}
                        </Text>
                      )}
                    </View>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor:
                            todo.priority === 'high' ? t.positivity : t.isDark ? 'rgba(242,241,238,0.1)' : 'rgba(13,13,13,0.05)',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: 'JetBrainsMono_400Regular',
                          color: todo.priority === 'high' ? '#FFF' : t.inkMid,
                        }}
                      >
                        {todo.priority[0].toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => removeTodo(todo.id)} style={{ padding: 8 }}>
                    <Trash2 size={16} color={t.inkDim} />
                  </Pressable>
                </Pressable>
              ))}
          </View>
        )}

        {completedTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: t.inkDim }]}>Completed ({completedTodos.length})</Text>
            {completedTodos.map((todo) => (
              <Pressable
                key={todo.id}
                style={[
                  styles.todoItem,
                  {
                    backgroundColor: t.isDark ? 'rgba(242,241,238,0.04)' : 'rgba(13,13,13,0.02)',
                    borderColor: t.border,
                  },
                ]}
              >
                <View style={styles.todoContent}>
                  <View style={[styles.checkbox, { borderColor: t.inkDim, backgroundColor: t.positivity }]}>
                    <Check size={14} color="#FFF" strokeWidth={3} />
                  </View>
                  <Text style={[styles.todoText, { color: t.inkDim, textDecorationLine: 'line-through' }]}>{todo.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTodos.length === 0 && completedTodos.length === 0 && (
          <View style={styles.empty}>
            <NotebookPen size={32} color={t.inkDim} style={{ marginBottom: 12 }} />
            <Text style={[styles.emptyText, { color: t.inkMid }]}>No tasks yet</Text>
            <Text style={[styles.emptySubtext, { color: t.inkDim }]}>Tap + to create one</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.addForm, { backgroundColor: t.card, borderTopColor: t.border, paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput
            placeholder="Add a task..."
            placeholderTextColor={t.inkDim}
            value={newTitle}
            onChangeText={setNewTitle}
            style={[styles.input, { color: t.ink, borderColor: t.border }]}
          />
          <Pressable onPress={handleAddTodo} style={[styles.addBtn, { backgroundColor: t.positivity }]}>
            <Plus size={20} color="#FFF" strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.prioritySelector}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityBtn,
                {
                  backgroundColor: priority === p ? t.positivity : t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.05)',
                },
              ]}
            >
              <Text style={[styles.priorityBtnText, { color: priority === p ? '#FFF' : t.inkMid }]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Syne_700Bold',
    letterSpacing: -0.01,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'JetBrainsMono_500Medium',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    flex: 1,
  },
  ruleTag: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'JetBrainsMono_400Regular',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  addForm: {
    borderTopWidth: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});

