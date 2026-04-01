import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from '@src/hooks/useRouter';
import { useAuthStore, useAppStore } from '@src/store';
import { Avatar, Card, Button } from '@src/components';
import { colors, typography, spacing, borderRadius, shadows } from '@src/theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface MenuItemProps {
  iconName: IconName;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}

function MenuItem({ iconName, label, subtitle, onPress, right, danger }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={iconName} size={18} color={danger ? colors.error[500] : colors.text.secondary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && styles.dangerText]}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {right || (
        <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notificationsEnabled, toggleNotifications, isDarkMode, toggleDarkMode } = useAppStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.userRow}>
            <Avatar name={user?.name || 'User'} size="xl" />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userRole}>{user?.role === 'manager' ? 'Manager' : user?.role}</Text>
              <Text style={styles.userBusiness}>{user?.businessName}</Text>
            </View>
          </View>
        </Card>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Card style={styles.menuCard}>
            <MenuItem iconName="mail-outline" label="Email" subtitle={user?.email} />
            <MenuItem iconName="call-outline" label="Phone" subtitle={user?.phone || 'Not set'} />
          </Card>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard}>
            <MenuItem
              iconName="notifications-outline"
              label="Notifications"
              right={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
                  thumbColor={notificationsEnabled ? colors.primary[600] : colors.neutral[400]}
                />
              }
            />
            <MenuItem
              iconName="moon-outline"
              label="Dark Mode"
              right={
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: colors.neutral[200], true: colors.primary[200] }}
                  thumbColor={isDarkMode ? colors.primary[600] : colors.neutral[400]}
                />
              }
            />
            <MenuItem iconName="globe-outline" label="Language" subtitle="English" />
          </Card>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Card style={styles.menuCard}>
            <MenuItem iconName="help-circle-outline" label="Help & Support" />
            <MenuItem iconName="shield-checkmark-outline" label="Privacy Policy" />
            <MenuItem iconName="document-text-outline" label="Terms of Service" />
          </Card>
        </View>

        {/* App Version */}
        <Text style={styles.version}>AgentHive v1.0.0</Text>

        {/* Logout */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          size="lg"
          style={styles.logoutButton}
        />

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
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  userCard: {
    marginBottom: spacing.xxl,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  userName: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  userRole: {
    ...typography.bodySmall,
    color: colors.primary[600],
    fontWeight: '500',
    marginBottom: spacing.xxs,
  },
  userBusiness: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    ...typography.label,
    color: colors.text.primary,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xxs,
  },
  dangerText: {
    color: colors.error[600],
  },
  version: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  logoutButton: {
    marginTop: spacing.lg,
    borderColor: colors.error[400],
  },
  bottomSpacing: {
    height: spacing['6xl'],
  },
});
