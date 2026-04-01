import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '@src/theme';

interface ChannelBadgeProps {
  channel: 'whatsapp' | 'messenger' | 'instagram';
  size?: 'sm' | 'md';
}

const channelConfig = {
  whatsapp: { color: '#25D366', bg: '#E8F8ED', label: 'WhatsApp' },
  messenger: { color: '#0084FF', bg: '#E5F0FF', label: 'Messenger' },
  instagram: { color: '#E1306C', bg: '#FDE8EF', label: 'Instagram' },
};

export function ChannelBadge({ channel, size = 'md' }: ChannelBadgeProps) {
  const config = channelConfig[channel];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: config.bg },
        size === 'sm' && styles.sm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }, size === 'sm' && styles.textSm]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 1,
  },
  text: {
    ...typography.captionBold,
    fontSize: 11,
  },
  textSm: {
    fontSize: 10,
  },
});
