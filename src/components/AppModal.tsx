import React from 'react';
import { Modal, StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { ThemedText } from './ThemedText';
import { X } from 'lucide-react-native';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function AppModal({ visible, onClose, title, description, children }: AppModalProps) {
  const t = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[styles.modalContent, { backgroundColor: t.bg, borderColor: t.border }]}
            >
              <View style={styles.header}>
                <ThemedText variant="h2">{title}</ThemedText>
                <Pressable 
                  onPress={onClose} 
                  style={[styles.closeBtn, { backgroundColor: t.surfaceHigh }]}
                  hitSlop={10}
                >
                  <X size={20} color={t.textSecondary} />
                </Pressable>
              </View>
              {description && (
                <ThemedText variant="body" color={t.textSecondary} style={{ marginBottom: 24, marginTop: 4 }}>
                  {description}
                </ThemedText>
              )}
              {children}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.padding,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
