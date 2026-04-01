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
import { Card, Badge, Avatar, ChannelBadge } from '@src/components';
import { colors, typography, spacing, borderRadius } from '@src/theme';
import { formatDateTime, formatCurrency, formatRelativeTime } from '@src/utils';
import { leadService, bookingService, conversationService } from '@src/services';
import type { Lead, Booking, Conversation } from '@src/types';

const leadStatusVariant: Record<string, 'success' | 'warning' | 'info' | 'default' | 'error'> = {
  new: 'info',
  contacted: 'default',
  qualified: 'warning',
  converted: 'success',
  lost: 'error',
};

export default function CustomerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [leadRes, bookRes, convRes] = await Promise.all([
        leadService.getById(id!),
        bookingService.getAll(),
        conversationService.getAll(),
      ]);
      if (leadRes.success) setLead(leadRes.data!);
      if (bookRes.success) setBookings(bookRes.data.filter((b) => b.customerId === id).slice(0, 3));
      if (convRes.success) setConversations(convRes.data.filter((c) => c.customerId === id).slice(0, 3));
    } catch (error) {
      console.error('Failed to load customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !lead) {
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
          <Text style={styles.headerTitle}>Customer Profile</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar name={lead.name} size="xl" />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{lead.name}</Text>
              <View style={styles.badgeRow}>
                <ChannelBadge channel={lead.source} size="sm" />
                <Badge label={lead.status} variant={leadStatusVariant[lead.status]} size="sm" />
              </View>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{lead.conversationsCount}</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{lead.bookingsCount}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(lead.totalSpent)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </Card>
        </View>

        {/* Contact Info */}
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.text.secondary} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{lead.email}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={colors.text.secondary} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{lead.phone}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.text.secondary} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Customer Since</Text>
              <Text style={styles.infoValue}>{formatDateTime(lead.createdAt)}</Text>
            </View>
          </View>
        </Card>

        {/* Tags */}
        {lead.tags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {lead.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="neutral" />
              ))}
            </View>
          </>
        )}

        {/* Recent Conversations */}
        <Text style={styles.sectionTitle}>Recent Conversations</Text>
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              onPress={() => router.push(`/chat/${conv.id}`)}
              activeOpacity={0.7}
            >
              <Card style={styles.convCard}>
                <View style={styles.convRow}>
                  <ChannelBadge channel={conv.channel} size="sm" />
                  <Text style={styles.convMessage} numberOfLines={1}>
                    {conv.lastMessage}
                  </Text>
                </View>
                <Text style={styles.convTime}>{formatRelativeTime(conv.lastMessageAt)}</Text>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No conversations yet</Text>
          </Card>
        )}

        {/* Recent Bookings */}
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              onPress={() => router.push(`/booking/${booking.id}`)}
              activeOpacity={0.7}
            >
              <Card style={styles.bookingCard}>
                <View style={styles.bookingRow}>
                  <View style={styles.bookingLeft}>
                    <Text style={styles.bookingRef}>{booking.reference}</Text>
                    <Text style={styles.bookingType}>{booking.type}</Text>
                  </View>
                  <View style={styles.bookingRight}>
                    <Text style={styles.bookingPrice}>{formatCurrency(booking.price)}</Text>
                    <Badge label={booking.status.replace('_', ' ')} variant="neutral" size="sm" />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No bookings yet</Text>
          </Card>
        )}

        {/* Notes Placeholder */}
        <Text style={styles.sectionTitle}>Notes</Text>
        <Card style={styles.notesCard}>
          <Text style={styles.notesPlaceholder}>
            {lead.notes || 'No notes yet. Add internal notes about this customer.'}
          </Text>
        </Card>

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
  profileCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  infoIcon: {
    marginRight: spacing.md,
    marginTop: 2,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  convCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  convMessage: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  convTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  bookingCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingLeft: {
    flex: 1,
  },
  bookingRef: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.xxs,
  },
  bookingType: {
    ...typography.bodySmall,
    color: colors.text.primary,
  },
  bookingRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  bookingPrice: {
    ...typography.label,
    color: colors.text.primary,
  },
  emptyCard: {
    marginHorizontal: spacing.xxl,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  notesCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  notesPlaceholder: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: spacing['5xl'],
  },
});
