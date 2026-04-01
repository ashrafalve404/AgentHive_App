import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from '@src/hooks/useRouter';
import { useLocalSearchParams } from 'expo-router';
import { Card, Badge, Button, Avatar } from '@src/components';
import { colors, typography, spacing, borderRadius } from '@src/theme';
import { formatDateTime, formatCurrency } from '@src/utils';
import { bookingService } from '@src/services';
import type { Booking } from '@src/types';

type IconName = keyof typeof Ionicons.glyphMap;

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'default',
  completed: 'success',
  cancelled: 'error',
};

const statusIcons: Record<string, IconName> = {
  pending: 'time-outline',
  confirmed: 'checkmark-circle-outline',
  in_progress: 'car-outline',
  completed: 'checkmark-done-circle-outline',
  cancelled: 'close-circle-outline',
};

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await bookingService.getById(id!);
      if (res.success) setBooking(res.data!);
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Reference & Status */}
        <Card style={styles.refCard}>
          <View style={styles.refRow}>
            <View>
              <Text style={styles.refLabel}>Reference</Text>
              <Text style={styles.refValue}>{booking.reference}</Text>
            </View>
            <Badge
              label={booking.status.replace('_', ' ')}
              variant={statusVariant[booking.status]}
            />
          </View>
          <Text style={styles.typeLabel}>{booking.type}</Text>
        </Card>

        {/* Price */}
        <Card style={styles.priceCard}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>{formatCurrency(booking.price, booking.currency)}</Text>
        </Card>

        {/* Customer Info */}
        <Text style={styles.sectionTitle}>Customer</Text>
        <Card style={styles.infoCard}>
          <View style={styles.customerRow}>
            <Avatar name={booking.customerName} size="md" />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{booking.customerName}</Text>
              <Text style={styles.customerContact}>{booking.customerEmail}</Text>
              <Text style={styles.customerContact}>{booking.customerPhone}</Text>
            </View>
          </View>
        </Card>

        {/* Schedule */}
        <Text style={styles.sectionTitle}>Schedule</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.text.secondary} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{formatDateTime(booking.scheduledAt)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.text.secondary} style={styles.infoIcon} />
            <View style={styles.infoFlex}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{booking.address}</Text>
            </View>
          </View>
        </Card>

        {/* Service Details */}
        <Text style={styles.sectionTitle}>Service Details</Text>
        <Card style={styles.infoCard}>
          <Text style={styles.serviceText}>{booking.serviceDetails}</Text>
          {booking.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{booking.notes}</Text>
            </View>
          )}
        </Card>

        {/* Status Timeline */}
        <Text style={styles.sectionTitle}>Status History</Text>
        <Card style={styles.timelineCard}>
          {booking.statusHistory.map((entry, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineDot}>
                <View style={[styles.dot, index === booking.statusHistory.length - 1 && styles.dotActive]} />
                {index < booking.statusHistory.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineStatusRow}>
                    <Ionicons
                      name={statusIcons[entry.status] || 'ellipse-outline'}
                      size={14}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.timelineStatus}>
                      {entry.status.replace('_', ' ')}
                    </Text>
                  </View>
                  <Text style={styles.timelineTime}>
                    {formatDateTime(entry.timestamp)}
                  </Text>
                </View>
                {entry.note && <Text style={styles.timelineNote}>{entry.note}</Text>}
              </View>
            </View>
          ))}
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {booking.status === 'pending' && (
            <>
              <Button title="Confirm Booking" onPress={() => {}} fullWidth size="lg" />
              <Button title="Cancel" onPress={() => {}} variant="outline" fullWidth size="lg" style={{ marginTop: spacing.md, borderColor: colors.error[400] }} />
            </>
          )}
          {booking.status === 'confirmed' && (
            <>
              <Button title="Start Service" onPress={() => {}} fullWidth size="lg" />
              <Button title="Cancel Booking" onPress={() => {}} variant="outline" fullWidth size="lg" style={{ marginTop: spacing.md }} />
            </>
          )}
          {booking.status === 'in_progress' && (
            <Button title="Mark as Complete" onPress={() => {}} fullWidth size="lg" />
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  headerRight: {
    width: 36,
  },
  refCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  refLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xxs,
  },
  refValue: {
    ...typography.h3,
    color: colors.text.primary,
  },
  typeLabel: {
    ...typography.bodySmall,
    color: colors.text.secondary,
  },
  priceCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  priceLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xxs,
  },
  priceValue: {
    ...typography.h1,
    color: colors.text.primary,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  infoCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.sm,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  customerName: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  customerContact: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  infoIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  infoFlex: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.xxs,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.primary,
  },
  serviceText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  notesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  notesLabel: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    marginBottom: spacing.xxs,
  },
  notesText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  timelineCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineDot: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neutral[300],
    marginTop: 4,
  },
  dotActive: {
    backgroundColor: colors.primary[600],
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border.light,
    marginTop: spacing.xs,
  },
  timelineContent: {
    flex: 1,
    marginLeft: spacing.md,
    paddingBottom: spacing.lg,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timelineStatus: {
    ...typography.label,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  timelineTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  timelineNote: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  actions: {
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
  },
  bottomSpacing: {
    height: spacing['5xl'],
  },
});
