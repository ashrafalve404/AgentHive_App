import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { colors, typography, spacing, borderRadius } from '@src/theme';
import { formatShortTime, formatCurrency } from '@src/utils';
import type { Booking } from '@src/types';

interface BookingCardProps {
  booking: Booking;
  onPress: (id: string) => void;
}

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default' | 'neutral'> = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'default',
  completed: 'success',
  cancelled: 'error',
};

export function BookingCard({ booking, onPress }: BookingCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(booking.id)}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.refContainer}>
            <Text style={styles.reference}>{booking.reference}</Text>
            <Badge label={booking.status.replace('_', ' ')} variant={statusVariant[booking.status]} size="sm" />
          </View>
          <Text style={styles.price}>{formatCurrency(booking.price, booking.currency)}</Text>
        </View>

        <Text style={styles.customerName}>{booking.customerName}</Text>
        <Text style={styles.type}>{booking.type}</Text>

        <View style={styles.footer}>
          <Text style={styles.date}>{formatShortTime(booking.scheduledAt)}</Text>
          <Text style={styles.address} numberOfLines={1}>
            {booking.address}
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  refContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reference: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    letterSpacing: 0.5,
  },
  price: {
    ...typography.h4,
    color: colors.text.primary,
  },
  customerName: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  type: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  date: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  address: {
    ...typography.caption,
    color: colors.text.tertiary,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
});
