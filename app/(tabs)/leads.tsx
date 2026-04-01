import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from '@src/hooks/useRouter';
import { LeadCard, EmptyState, SkeletonList } from '@src/components';
import { FilterBar } from '@src/components/chips';
import { colors, typography, spacing } from '@src/theme';
import { leadService } from '@src/services';
import { FILTER_TABS } from '@src/constants';
import type { Lead } from '@src/types';

export default function LeadsScreen() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const loadData = async () => {
    try {
      const res = await leadService.getAll();
      if (res.success) {
        setLeads(res.data);
        setFiltered(res.data);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
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
      let result = leads;
      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            l.phone.includes(q)
        );
      }
      if (filter !== 'All') {
        result = result.filter((l) => l.status === filter.toLowerCase());
      }
      setFiltered(result);
    },
    [leads]
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
          <Text style={styles.title}>Leads & Customers</Text>
        </View>
        <SkeletonList count={5} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads & Customers</Text>
        <Text style={styles.subtitle}>{leads.length} contacts</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, or phone..."
          placeholderTextColor={colors.text.disabled}
          value={search}
          onChangeText={onSearch}
        />
      </View>

      <FilterBar
        filters={FILTER_TABS.leads}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeadCard
            lead={item}
            onPress={(id) => router.push(`/customer/${id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No leads found"
            subtitle="Your leads and customers will appear here once they start interacting with your business."
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
