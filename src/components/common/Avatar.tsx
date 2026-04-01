import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '@src/theme';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const sizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const textSizes = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColor(name: string): string {
  const avatarColors = [
    colors.primary[500],
    '#6366F1',
    '#8B5CF6',
    '#A855F7',
    '#D946EF',
    '#EC4899',
    '#F43F5E',
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#EAB308',
    '#84CC16',
    '#22C55E',
    '#14B8A6',
    '#06B6D4',
    '#0EA5E9',
    '#3B82F6',
  ];
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

export function Avatar({ name, size = 'md', color }: AvatarProps) {
  const sizeValue = sizes[size];
  const textSize = textSizes[size];
  const bgColor = color || getColor(name);

  return (
    <View
      style={[
        styles.base,
        {
          width: sizeValue,
          height: sizeValue,
          borderRadius: sizeValue / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: textSize, color: colors.neutral[0] }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
