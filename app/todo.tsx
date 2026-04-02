import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { X } from 'lucide-react-native';

export default function TodoModal() {
  const t = useTheme();
  const router = useRouter();
  const [task, setTask] = useState('');

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
        <Text style={[styles.title, { color: t.ink }]}>Capture a Task</Text>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: t.card, 
              color: t.ink, 
              borderColor: t.border 
            }
          ]}
          placeholder="What's on your mind?"
          placeholderTextColor={t.inkDim}
          autoFocus
          value={task}
          onChangeText={setTask}
        />

        <Pressable 
          style={[styles.saveBtn, { backgroundColor: t.isDark ? '#F2F1EE' : '#0D0D0D' }]}
          onPress={() => {
            // TODO: dispatch to TodoStore
            router.back();
          }}
        >
          <Text style={[styles.saveText, { color: t.isDark ? '#0D0D0D' : '#FFFFFF' }]}>Save to Inbox</Text>
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
    fontFamily: 'DMSerifDisplay',
    fontSize: 28,
    marginBottom: 24,
  },
  input: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  saveBtn: {
    paddingVertical: 18,
    borderRadius: 9999,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
  }
});
