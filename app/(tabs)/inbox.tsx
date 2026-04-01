import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from '@src/hooks/useRouter';
import { ConversationCard, EmptyState, SkeletonList } from '@src/components';
import { FilterBar } from '@src/components/chips';
import { colors, typography, spacing } from '@src/theme';
import { conversationService } from '@src/services';
import { FILTER_TABS } from '@src/constants';
import type { Conversation } from '@src/types';

export default function InboxScreen() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filtered, setFiltered] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const loadData = async () => {
    try {
      const res = await conversationService.getAll();
      if (res.success) {
        setConversations(res.data);
        setFiltered(res.data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyFilters = useCallback(
    (query: string, filter: string) => {
      let result = conversations;
      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
          (c) =>
            c.customerName.toLowerCase().includes(q) ||
            c.lastMessage.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (filter !== 'All') {
        if (filter === 'AI Handled') result = result.filter((c) => c.handlerType === 'ai');
        else if (filter === 'Human') result = result.filter((c) => c.handlerType === 'human');
        else result = result.filter((c) => c.status === filter.toLowerCase());
      }
      setFiltered(result);
    },
    [conversations]
  );

  const onSearch = (text: string) => {
    setSearch(text);
    applyFilters(text, activeFilter);
  };

  const onFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilters(search, filter);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Inbox</Text>
        </View>
        <SkeletonList count={6} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.subtitle}>{conversations.length} conversations</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={colors.text.disabled}
          value={search}
          onChangeText={onSearch}
        />
      </View>

      <FilterBar
        filters={FILTER_TABS.conversations}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard
            conversation={item}
            onPress={(id) => router.push(`/chat/${id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No active conversations yet"
            subtitle="When customers message you on WhatsApp, Messenger, or Instagram, they'll appear here."
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
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
  searchContainer: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  list: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
  },
});
