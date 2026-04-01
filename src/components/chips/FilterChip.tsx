import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@src/theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  count?: number;
}

export function FilterChip({ label, active, onPress, count }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.base, active && styles.active]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
        {count !== undefined && count > 0 ? ` (${count})` : ''}
      </Text>
    </TouchableOpacity>
  );
}

interface FilterBarProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts?: Record<string, number>;
}

export function FilterBar({ filters, activeFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <View style={styles.bar}>
      {filters.map((filter) => (
        <FilterChip
          key={filter}
          label={filter}
          active={activeFilter === filter}
          onPress={() => onFilterChange(filter)}
          count={counts?.[filter]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 1,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.sm,
  },
  active: {
    backgroundColor: colors.primary[600],
  },
  text: {
    ...typography.captionBold,
    color: colors.text.secondary,
  },
  activeText: {
    color: colors.neutral[0],
  },
  bar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
