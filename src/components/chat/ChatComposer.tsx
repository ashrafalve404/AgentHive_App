import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@src/theme';

interface ChatComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatComposer({
  value,
  onChangeText,
  onSend,
  onAttach,
  placeholder = 'Type a message...',
  disabled = false,
}: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <View style={styles.inputRow}>
          {onAttach && (
            <TouchableOpacity style={styles.attachButton} onPress={onAttach} activeOpacity={0.7}>
              <Text style={styles.attachIcon}>+</Text>
            </TouchableOpacity>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.text.disabled}
              value={value}
              onChangeText={onChangeText}
              multiline
              maxLength={1000}
              editable={!disabled}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, canSend && styles.sendButtonActive]}
            onPress={onSend}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            <Text style={[styles.sendIcon, canSend && styles.sendIconActive]}>{'\u2191'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl + spacing.md : spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 20,
    color: colors.text.secondary,
    fontWeight: '300',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    maxHeight: 120,
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    minHeight: 36,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: colors.primary[600],
  },
  sendIcon: {
    fontSize: 16,
    color: colors.text.disabled,
    fontWeight: '600',
  },
  sendIconActive: {
    color: colors.neutral[0],
  },
});
