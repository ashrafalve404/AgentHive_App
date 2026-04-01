import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { ChannelBadge } from '../common/ChannelBadge';
import { Badge } from '../common/Badge';
import { colors, typography, spacing } from '@src/theme';
import { formatShortTime } from '@src/utils';
import type { Conversation } from '@src/types';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: (id: string) => void;
}

const handlerBadgeVariant = (type: string) => {
  return type === 'ai' ? 'info' : 'default';
};

export function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(conversation.id)}>
      <Card style={styles.container}>
        <View style={styles.row}>
          <Avatar name={conversation.customerName} size="md" />
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={styles.name} numberOfLines={1}>
                {conversation.customerName}
              </Text>
              <Text style={styles.time}>
                {formatShortTime(conversation.lastMessageAt)}
              </Text>
            </View>
            <Text style={styles.message} numberOfLines={1}>
              {conversation.lastMessage}
            </Text>
            <View style={styles.bottomRow}>
              <View style={styles.tags}>
                <ChannelBadge channel={conversation.channel} size="sm" />
                <Badge
                  label={conversation.handlerType === 'ai' ? 'AI' : 'Human'}
                  variant={handlerBadgeVariant(conversation.handlerType)}
                  size="sm"
                />
              </View>
              {conversation.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                </View>
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
  message: {
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
  unreadBadge: {
    backgroundColor: colors.primary[600],
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadText: {
    ...typography.captionBold,
    color: colors.neutral[0],
    fontSize: 11,
  },
});
