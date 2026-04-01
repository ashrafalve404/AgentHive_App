import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@src/theme';
import { formatTime } from '@src/utils';
import type { Message } from '@src/types';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
}

export function MessageBubble({ message, showSender = true }: MessageBubbleProps) {
  const isCustomer = message.sender === 'customer';
  const isSystem = message.sender === 'ai' && message.type === 'system';

  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.content}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isCustomer ? styles.containerLeft : styles.containerRight]}>
      <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleOther]}>
        {showSender && !isCustomer && (
          <Text style={styles.senderName}>
            {message.sender === 'ai' ? 'AI Assistant' : message.senderName || 'Agent'}
          </Text>
        )}
        {message.type === 'image' && (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Image</Text>
          </View>
        )}
        {message.type === 'voice' && (
          <View style={styles.voicePlaceholder}>
            <Text style={styles.voiceIcon}>{'\u25B6'}</Text>
            <View style={styles.voiceWave}>
              {[12, 20, 8, 24, 16, 28, 12, 20, 8, 24, 16, 28, 12, 20, 8].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.voiceBar,
                    { height: h, backgroundColor: isCustomer ? colors.primary[400] : colors.neutral[400] },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.voiceDuration}>
              {message.voiceDuration ? `${message.voiceDuration}s` : '0:12'}
            </Text>
          </View>
        )}
        {message.type === 'text' && (
          <Text style={[styles.text, isCustomer ? styles.textCustomer : styles.textOther]}>
            {message.content}
          </Text>
        )}
        <Text style={[styles.time, isCustomer ? styles.timeCustomer : styles.timeOther]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.dateLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xxs,
    paddingHorizontal: spacing.lg,
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  bubbleCustomer: {
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: spacing.xxs,
  },
  bubbleOther: {
    backgroundColor: colors.primary[600],
    borderBottomRightRadius: spacing.xxs,
  },
  senderName: {
    ...typography.captionBold,
    color: colors.primary[400],
    marginBottom: spacing.xxs,
  },
  text: {
    ...typography.body,
    lineHeight: 22,
  },
  textCustomer: {
    color: colors.text.primary,
  },
  textOther: {
    color: colors.neutral[0],
  },
  time: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  timeCustomer: {
    color: colors.text.tertiary,
    textAlign: 'right',
  },
  timeOther: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'right',
  },
  systemContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['3xl'],
  },
  systemText: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    backgroundColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  imagePlaceholderText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  voicePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    minWidth: 180,
  },
  voiceIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
    color: colors.text.primary,
  },
  voiceWave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  voiceBar: {
    width: 3,
    borderRadius: 1.5,
  },
  voiceDuration: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dateText: {
    ...typography.caption,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.md,
  },
});
