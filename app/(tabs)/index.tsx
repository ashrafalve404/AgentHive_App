import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from '@src/hooks/useRouter';
import { useAuthStore } from '@src/store';
import { Card, Avatar, ConversationCard, SkeletonDashboard, Button } from '@src/components';
import { StatCard } from '@src/components/cards/StatCard';
import { colors, typography, spacing, borderRadius, shadows } from '@src/theme';
import { getGreeting, formatCurrency } from '@src/utils';
import { dashboardService, conversationService, bookingService } from '@src/services';
import type { DashboardStats, Conversation, Booking } from '@src/types';

type IconName = keyof typeof Ionicons.glyphMap;

const quickActions: { label: string; iconName: IconName; route: string }[] = [
  { label: 'Inbox', iconName: 'chatbubble-ellipses-outline', route: '/(tabs)/inbox' },
  { label: 'Bookings', iconName: 'calendar-outline', route: '/(tabs)/bookings' },
  { label: 'Leads', iconName: 'people-outline', route: '/(tabs)/leads' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, convRes, bookRes] = await Promise.all([
        dashboardService.getStats(),
        conversationService.getAll(),
        bookingService.getAll(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (convRes.success) setConversations(convRes.data.slice(0, 3));
      if (bookRes.success) setBookings(bookRes.data.filter((b) => b.status !== 'completed' && b.status !== 'cancelled').slice(0, 3));
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <SkeletonDashboard />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{user?.name?.split(' ')[0] || 'there'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/notifications')} activeOpacity={0.7}>
            <View style={styles.notifButton}>
              <Ionicons name="notifications-outline" size={22} color={colors.text.primary} />
              <View style={styles.notifDot} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.business}>{user?.businessName || 'Your Business'}</Text>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={() => router.push(action.route)}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.iconName} size={22} color={colors.primary[600]} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                label="Active Chats"
                value={stats.activeChats}
                change="+3 today"
                changeType="up"
                color={colors.primary[500]}
              />
              <StatCard
                label="Pending Bookings"
                value={stats.pendingBookings}
                change="2 new"
                changeType="up"
                color={colors.warning[500]}
              />
              <StatCard
                label="Total Leads"
                value={stats.totalLeads}
                change="+12 this week"
                changeType="up"
                color={colors.success[500]}
              />
              <StatCard
                label="Conversions Today"
                value={stats.todayConversions}
                change="On track"
                changeType="neutral"
                color={colors.info[500]}
              />
            </View>
          </View>
        )}

        {/* AI Activity */}
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Activity Today</Text>
            <Card style={styles.aiCard}>
              <View style={styles.aiRow}>
                <View style={styles.aiStat}>
                  <Text style={styles.aiValue}>{stats.aiHandledToday}</Text>
                  <Text style={styles.aiLabel}>AI Handled</Text>
                </View>
                <View style={styles.aiDivider} />
                <View style={styles.aiStat}>
                  <Text style={styles.aiValue}>{stats.humanHandledToday}</Text>
                  <Text style={styles.aiLabel}>Human Handled</Text>
                </View>
                <View style={styles.aiDivider} />
                <View style={styles.aiStat}>
                  <Text style={styles.aiValue}>{stats.responseTime}</Text>
                  <Text style={styles.aiLabel}>Avg Response</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Recent Conversations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Conversations</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/inbox')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {conversations.map((conv) => (
            <ConversationCard
              key={conv.id}
              conversation={conv}
              onPress={(id) => router.push(`/chat/${id}`)}
            />
          ))}
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {bookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingItem}
              onPress={() => router.push(`/booking/${booking.id}`)}
              activeOpacity={0.7}
            >
              <Card style={styles.bookingCard}>
                <View style={styles.bookingRow}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingRef}>{booking.reference}</Text>
                    <Text style={styles.bookingCustomer}>{booking.customerName}</Text>
                    <Text style={styles.bookingType}>{booking.type}</Text>
                  </View>
                  <View style={styles.bookingRight}>
                    <Text style={styles.bookingPrice}>{formatCurrency(booking.price)}</Text>
                    <View style={[styles.statusDot, { backgroundColor: booking.status === 'confirmed' ? colors.info[500] : colors.warning[500] }]} />
                    <Text style={styles.bookingStatus}>{booking.status}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
          {bookings.length === 0 && (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No upcoming bookings</Text>
            </Card>
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
  scroll: {
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  headerLeft: {},
  greeting: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
  },
  business: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xxs,
    marginBottom: spacing.xxl,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error[500],
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionLabel: {
    ...typography.captionBold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  seeAll: {
    ...typography.label,
    color: colors.primary[600],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  aiCard: {
    marginHorizontal: spacing.xxl,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStat: {
    flex: 1,
    alignItems: 'center',
  },
  aiValue: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  aiLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  aiDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },
  bookingItem: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.sm,
  },
  bookingCard: {
    padding: spacing.lg,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingRef: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.xxs,
  },
  bookingCustomer: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  bookingType: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  bookingRight: {
    alignItems: 'flex-end',
  },
  bookingPrice: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.xxs,
  },
  bookingStatus: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  emptyCard: {
    marginHorizontal: spacing.xxl,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
  },
  bottomSpacing: {
    height: spacing['4xl'],
  },
});
