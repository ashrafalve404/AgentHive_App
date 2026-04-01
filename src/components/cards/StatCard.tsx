import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { colors, typography, spacing, borderRadius } from '@src/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon, color }: StatCardProps) {
  const accentColor = color || colors.primary[500];

  return (
    <Card style={styles.container}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          {icon && <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>{icon}</View>}
          {change && (
            <Text
              style={[
                styles.change,
                changeType === 'up' && styles.changeUp,
                changeType === 'down' && styles.changeDown,
              ]}
            >
              {changeType === 'up' ? '\u2191' : changeType === 'down' ? '\u2193' : ''} {change}
            </Text>
          )}
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 0,
    overflow: 'hidden',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  change: {
    ...typography.captionBold,
    color: colors.text.tertiary,
  },
  changeUp: {
    color: colors.success[600],
  },
  changeDown: {
    color: colors.error[600],
  },
  value: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  label: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
