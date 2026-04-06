import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { X } from 'lucide-react-native';
import { ThemedText } from '../src/components/ThemedText';
import { useTodoStore } from '../src/store/todoStore';

export default function TodoModal() {
  const t = useTheme();
  const router = useRouter();
  const addTodo = useTodoStore((s) => s.addTodo);
  
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSave = () => {
    if (task.trim()) {
      addTodo(task.trim(), [], priority);
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      
      {/* Drawer Handle Area */}
      <View style={styles.header}>
        <View style={styles.handleWrap}>
          <View style={[styles.handle, { backgroundColor: t.inkMid }]} />
        </View>
        <Pressable 
          style={styles.closeBtn}
          onPress={() => router.back()}
        >
          <X size={24} color={t.ink} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <ThemedText variant="h1" style={styles.title}>Capture a Task</ThemedText>
        
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: t.surfaceLow, 
              color: t.ink, 
              borderColor: t.border 
            }
          ]}
          placeholder="What's on your mind?"
          placeholderTextColor={t.inkDim}
          autoFocus
          value={task}
          onChangeText={setTask}
          onSubmitEditing={handleSave}
        />

        <View style={styles.priorityLabelRow}>
          <ThemedText variant="label" color={t.textSecondary}>Priority</ThemedText>
        </View>

        <View style={styles.priorityContainer}>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityPill,
                {
                  backgroundColor: priority === p ? (p === 'high' ? t.focus : (p === 'medium' ? t.warning : t.positivity)) : t.surfaceHigh,
                  borderColor: priority === p ? 'transparent' : t.border,
                }
              ]}
            >
              <ThemedText 
                variant="label" 
                style={{ 
                  color: priority === p ? '#000' : t.textSecondary,
                  textTransform: 'capitalize'
                }}
              >
                {p}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <Pressable 
          style={[
            styles.saveBtn, 
            { 
              backgroundColor: task.trim() ? t.positivity : t.surfaceHigh,
              opacity: task.trim() ? 1 : 0.5 
            }
          ]}
          onPress={handleSave}
          disabled={!task.trim()}
        >
          <ThemedText variant="h3" style={[styles.saveText, { color: '#000' }]}>Save to Inbox</ThemedText>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    justifyContent: 'center',
  },
  handleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    marginBottom: 24,
    letterSpacing: -0.02,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  priorityLabelRow: {
    marginBottom: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  priorityPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  saveBtn: {
    paddingVertical: 18,
    borderRadius: 9999,
    alignItems: 'center',
  },
  saveText: {
    fontWeight: '800',
    fontSize: 16,
  }
});

