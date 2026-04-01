import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '@src/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({ children, variant = 'default', padding, style }: CardProps) {
  const cardStyles: ViewStyle[] = [styles.base, styles[variant]];
  if (padding !== undefined) cardStyles.push({ padding });
  if (style) cardStyles.push(style);

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    padding: 16,
    backgroundColor: colors.background.primary,
  },
  default: {
    backgroundColor: colors.background.primary,
    ...shadows.sm,
  },
  elevated: {
    backgroundColor: colors.background.primary,
    ...shadows.md,
  },
  outlined: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
