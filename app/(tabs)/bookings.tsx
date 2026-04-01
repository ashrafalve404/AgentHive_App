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
import { BookingCard, EmptyState, SkeletonList } from '@src/components';
import { FilterBar } from '@src/components/chips';
import { colors, typography, spacing } from '@src/theme';
import { bookingService } from '@src/services';
import { FILTER_TABS } from '@src/constants';
import type { Booking } from '@src/types';

export default function BookingsScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const loadData = async () => {
    try {
      const res = await bookingService.getAll();
      if (res.success) {
        setBookings(res.data);
        setFiltered(res.data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
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
      let result = bookings;
      if (query.trim()) {
        const q = query.toLowerCase();
        result = result.filter(
          (b) =>
            b.customerName.toLowerCase().includes(q) ||
            b.reference.toLowerCase().includes(q) ||
            b.type.toLowerCase().includes(q)
        );
      }
      if (filter !== 'All') {
        result = result.filter((b) => b.status === filter.toLowerCase().replace(' ', '_'));
      }
      setFiltered(result);
    },
    [bookings]
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
          <Text style={styles.title}>Bookings</Text>
        </View>
        <SkeletonList count={5} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={styles.subtitle}>{bookings.length} total bookings</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bookings..."
          placeholderTextColor={colors.text.disabled}
          value={search}
          onChangeText={onSearch}
        />
      </View>

      <FilterBar
        filters={FILTER_TABS.bookings}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={(id) => router.push(`/booking/${id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary[600]} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No bookings found"
            subtitle="When bookings are created, they'll appear here. Pull down to refresh."
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
