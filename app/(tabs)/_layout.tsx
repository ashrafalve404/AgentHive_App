import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@src/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  label,
  iconName,
  focused,
}: {
  label: string;
  iconName: IconName;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIcon}>
      <Ionicons
        name={iconName}
        size={22}
        color={focused ? colors.primary[600] : colors.text.disabled}
      />
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const unreadCount = 6;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" iconName="home-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon label="Inbox" iconName="chatbubble-ellipses-outline" focused={focused} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Booking" iconName="calendar-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Leads" iconName="people-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Alerts" iconName="notifications-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" iconName="person-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    height: 88,
    paddingTop: 8,
    paddingBottom: 28,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  label: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 3,
    fontSize: 10,
    letterSpacing: -0.1,
  },
  labelFocused: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -14,
    backgroundColor: colors.error[500],
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral[0],
  },
});
