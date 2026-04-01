import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from '@src/hooks/useRouter';
import { EmptyState, SkeletonList } from '@src/components';
import { colors, typography, spacing, borderRadius } from '@src/theme';
import { formatRelativeTime, formatDate } from '@src/utils';
import { notificationService } from '@src/services';
import type { AppNotification, NotificationType } from '@src/types';

type IconName = keyof typeof Ionicons.glyphMap;

const notifIcons: Record<NotificationType, IconName> = {
  new_chat: 'chatbubble-ellipses-outline',
  booking_update: 'calendar-outline',
  ai_handoff: 'hardware-chip-outline',
  lead_activity: 'people-outline',
  system: 'settings-outline',
};

const notifIconColors: Record<NotificationType, string> = {
  new_chat: colors.primary[600],
  booking_update: colors.info[600],
  ai_handoff: colors.warning[600],
  lead_activity: colors.success[600],
  system: colors.text.tertiary,
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await notificationService.getAll();
      if (res.success) setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
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

  const handlePress = async (notification: AppNotification) => {
    await notificationService.markAsRead(notification.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    if (notification.data?.conversationId) {
      router.push(`/chat/${notification.data.conversationId}`);
    } else if (notification.data?.bookingId) {
      router.push(`/booking/${notification.data.bookingId}`);
    } else if (notification.data?.leadId) {
      router.push(`/customer/${notification.data.leadId}`);
    }
  };

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const grouped = notifications.reduce(
    (acc, notif) => {
      const date = formatDate(notif.timestamp);
      if (!acc[date]) acc[date] = [];
      acc[date].push(notif);
      return acc;
    },
    {} as Record<string, AppNotification[]>
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
        </View>
        <SkeletonList count={6} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.subtitle}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={Object.entries(grouped)}
        keyExtractor={([date]) => date}
        renderItem={({ item: [date, items] }) => (
          <View style={styles.group}>
            <Text style={styles.groupDate}>{date}</Text>
            {items.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifItem, !notif.read && styles.notifUnread]}
                onPress={() => handlePress(notif)}
                activeOpacity={0.7}
              >
                <View style={[styles.notifIcon, { backgroundColor: notifIconColors[notif.type] + '15' }]}>
                  <Ionicons
                    name={notifIcons[notif.type]}
                    size={20}
                    color={notifIconColors[notif.type]}
                  />
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                    {notif.title}
                  </Text>
                  <Text style={styles.notifBody}>{notif.body}</Text>
                  <Text style={styles.notifTime}>{formatRelativeTime(notif.timestamp)}</Text>
                </View>
                {!notif.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
        }
        ListEmptyComponent={
          <EmptyState
            title="You're all caught up"
            subtitle="No new notifications. When something happens, you'll see it here."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.xxs,
  },
  markAll: {
    ...typography.label,
    color: colors.primary[600],
  },
  list: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing['4xl'],
  },
  group: {
    marginBottom: spacing.xl,
  },
  groupDate: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  notifUnread: {
    backgroundColor: colors.primary[50],
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  notifTitleUnread: {
    fontWeight: '600',
  },
  notifBody: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
    lineHeight: 20,
  },
  notifTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[600],
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
  },
});
