import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { X } from 'lucide-react-native';

interface ThemedAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function ThemedAlert({ visible, title, message, onClose }: ThemedAlertProps) {
  const t = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable 
        style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        onPress={onClose}
      >
        <View style={styles.centerContainer}>
          <Pressable
            style={[
              styles.modal,
              {
                backgroundColor: t.card,
                borderColor: t.border,
              }
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: t.ink }]}>{title}</Text>
              <Pressable onPress={onClose} style={styles.closeBtn}>
                <X size={20} color={t.inkMid} strokeWidth={2} />
              </Pressable>
            </View>

            {/* Message */}
            <Text style={[styles.message, { color: t.inkMid }]}>{message}</Text>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable
                onPress={onClose}
                style={[
                  styles.button,
                  styles.primaryButton,
                  { backgroundColor: t.positivity }
                ]}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>Got it</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 340,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    flex: 1,
    letterSpacing: -0.02,
  },
  closeBtn: {
    padding: 8,
    marginRight: -8,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    // backgroundColor set inline
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
