import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '@src/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.primary[50], text: colors.primary[700] },
  success: { bg: colors.success[50], text: colors.success[700] },
  warning: { bg: colors.warning[50], text: colors.warning[700] },
  error: { bg: colors.error[50], text: colors.error[700] },
  info: { bg: colors.info[50], text: colors.info[700] },
  neutral: { bg: colors.neutral[100], text: colors.neutral[600] },
};

export function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const colorSet = variantColors[variant];

  return (
    <View style={[styles.base, { backgroundColor: colorSet.bg }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: colorSet.text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  text: {
    ...typography.captionBold,
  },
  textSm: {
    fontSize: 10,
    lineHeight: 14,
  },
});
