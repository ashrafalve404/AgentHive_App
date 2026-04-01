import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { ChannelBadge } from '../common/ChannelBadge';
import { Badge } from '../common/Badge';
import { colors, typography, spacing } from '@src/theme';
import { formatShortTime, formatCurrency } from '@src/utils';
import type { Lead } from '@src/types';

interface LeadCardProps {
  lead: Lead;
  onPress: (id: string) => void;
}

const leadStatusVariant: Record<string, 'success' | 'warning' | 'info' | 'default' | 'error'> = {
  new: 'info',
  contacted: 'default',
  qualified: 'warning',
  converted: 'success',
  lost: 'error',
};

export function LeadCard({ lead, onPress }: LeadCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(lead.id)}>
      <Card style={styles.container}>
        <View style={styles.row}>
          <Avatar name={lead.name} size="md" />
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={styles.name} numberOfLines={1}>
                {lead.name}
              </Text>
              <Text style={styles.time}>{formatShortTime(lead.lastInteraction)}</Text>
            </View>
            <Text style={styles.email} numberOfLines={1}>
              {lead.email}
            </Text>
            <View style={styles.bottomRow}>
              <View style={styles.tags}>
                <ChannelBadge channel={lead.source} size="sm" />
                <Badge label={lead.status} variant={leadStatusVariant[lead.status]} size="sm" />
              </View>
              {lead.totalSpent > 0 && (
                <Text style={styles.spent}>{formatCurrency(lead.totalSpent)}</Text>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  name: {
    ...typography.label,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  email: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  spent: {
    ...typography.captionBold,
    color: colors.success[600],
  },
});
