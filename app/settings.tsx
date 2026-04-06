import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bug, CircleAlert, Info, Download, User as UserIcon, Check, ChevronRight, Eye, Droplets, Accessibility, Moon } from 'lucide-react-native';
import { useEffect } from 'react';

import { useTheme } from '../src/theme/ThemeContext';
import { useSettingsStore } from '../src/store/settingsStore';
import { usePositivityStore } from '../src/store/positivityStore';
import { useSessionStore } from '../src/store/sessionStore';
import { useTodoStore } from '../src/store/todoStore';
import { useWellnessStore } from '../src/store/wellnessStore';
import { getRuntimeLogs, logRuntimeEvent } from '../src/utils/runtimeLogs';
import { UpdateManager } from '../src/services/UpdateManager';
import { getPermissionStatus, requestNotificationPermissions as requestPerms } from '../src/services/NotificationManager';
import { ThemedText } from '../src/components/ThemedText';
import { tokens } from '../src/theme/tokens';

const CURRENT_VERSION_CHANGES = [
  'Android CI build reliability and performance improved.',
  'App icons and splash branding updated.',
  'Navigation and tab bar behavior polished for better UX.',
  'Typography aligned to design system fonts.',
  'Bug report export added in Settings.',
];

function WellnessNotificationsSection() {
  const t = useTheme();
  const notifications = useWellnessStore((s) => s.notifications);
  const setNotificationEnabled = useWellnessStore((s) => s.setNotificationEnabled);

  const groups = [
    { name: 'Vision', ids: ['blink-eye', '20-20-20'], icon: <Eye size={12} color={t.positivity} /> },
    { name: 'Hydration', ids: ['drink-water'], icon: <Droplets size={12} color={t.positivity} /> },
    { name: 'Body', ids: ['posture-check'], icon: <Accessibility size={12} color={t.positivity} /> },
    { name: 'Recovery', ids: ['sleep-time'], icon: <Moon size={12} color={t.positivity} /> },
  ];

  const [permStatus, setPermStatus] = useState<{ granted: boolean; canAskAgain: boolean } | null>(null);

  useEffect(() => {
    getPermissionStatus().then(setPermStatus);
  }, []);

  const handleToggle = async (id: string, enabled: boolean) => {
    if (enabled && permStatus && !permStatus.granted) {
      const granted = await requestPerms();
      setPermStatus({ granted, canAskAgain: true });
      if (!granted) {
        Alert.alert('Permission Required', 'Notifications are disabled for Productive+. Please enable them in your system settings to use wellness reminders.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => { /* Add Linking to settings if needed */ } }
        ]);
        return;
      }
    }
    setNotificationEnabled(id as any, enabled);
    logRuntimeEvent('settings_toggle_wellness_notification', { notification: id, enabled }).catch(() => {});
  };

  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      {!permStatus?.granted && (
        <Pressable 
          onPress={async () => {
            const granted = await requestPerms();
            setPermStatus({ granted, canAskAgain: true });
          }}
          style={[styles.notificationWarning, { backgroundColor: t.isDark ? 'rgba(255,165,0,0.1)' : 'rgba(255,165,0,0.05)', borderColor: t.warning }]}
        >
          <CircleAlert size={14} color={t.warning} />
          <ThemedText variant="caption" color={t.warning} style={{ marginLeft: 8, fontWeight: '700' }}>
            Notifications are Restricted
          </ThemedText>
          <ThemedText variant="caption" color={t.warning} style={{ marginLeft: 'auto', textDecorationLine: 'underline' }}>Fix</ThemedText>
        </Pressable>
      )}
      {groups.map((group) => {
        const groupNotifications = notifications.filter(n => group.ids.includes(n.id) && n.label && n.label !== '--');
        if (groupNotifications.length === 0) return null;
        
        return (
          <View key={group.name} style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              {group.icon}
              <ThemedText variant="label" color={t.positivity} style={{ fontSize: 10 }}>{group.name}</ThemedText>
            </View>
            {groupNotifications.map((notification) => (
              <View key={notification.id} style={styles.notificationInner}>
                <View style={styles.notificationRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="body" style={{ fontWeight: '700' }} color={t.text}>
                      {notification.label}
                    </ThemedText>
                    <ThemedText variant="caption" color={t.textSecondary}>
                      {notification.description}
                    </ThemedText>
                  </View>
                  <Switch
                    value={notification.enabled}
                    onValueChange={(enabled) => handleToggle(notification.id, enabled)}
                    trackColor={{ false: 'rgba(255,255,255,0.05)', true: t.positivity }}
                    thumbColor={notification.enabled ? '#FFFFFF' : '#888'}
                  />
                </View>
                {notification.enabled && (
                  <View style={{ marginTop: 12 }}>
                    {(notification.notificationTime !== undefined || notification.id === 'sleep-time') ? (
                      <View>
                        <ThemedText variant="caption" color={t.textSecondary} style={{ marginBottom: 8 }}>
                          Triggers at {((notification.notificationTime || 22) === 0 ? '12 AM' : (notification.notificationTime || 22) === 12 ? '12 PM' : (notification.notificationTime || 22) > 12 ? `${(notification.notificationTime || 22) - 12} PM` : `${(notification.notificationTime || 22)} PM`)}
                        </ThemedText>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 6, paddingRight: 20 }}
                        >
                          {[20, 21, 22, 23, 0].map((hour) => (
                            <Pressable
                              key={hour}
                              onPress={() => useWellnessStore.getState().updateNotificationTime(notification.id, hour)}
                              style={[
                                styles.timePill,
                                {
                                  backgroundColor: notification.notificationTime === hour ? t.positivity : t.surfaceHigh,
                                  borderColor: notification.notificationTime === hour ? t.positivity : 'transparent',
                                }
                              ]}
                            >
                              <ThemedText 
                                variant="caption" 
                                style={{ 
                                  color: notification.notificationTime === hour ? '#000' : t.textSecondary,
                                  fontWeight: notification.notificationTime === hour ? '800' : '500'
                                }}
                              >
                                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} PM`}
                              </ThemedText>
                            </Pressable>
                          ))}
                          <Pressable
                            onPress={() => Alert.alert('Custom Trigger', 'Native time picker integration is coming in the next build. For now, please use the available presets.')}
                            style={[styles.timePill, { backgroundColor: t.surfaceHigh, borderColor: 'transparent' }]}
                          >
                            <ThemedText variant="caption" color={t.textSecondary}>Custom</ThemedText>
                          </Pressable>
                        </ScrollView>
                      </View>
                    ) : (
                      <ThemedText variant="caption" color={t.textSecondary}>
                        Every {notification.intervalMinutes} min
                      </ThemedText>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();

  const userName = useSettingsStore((s) => s.userName);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const autoCheckUpdates = useSettingsStore((s) => s.autoCheckUpdates);
  const setAutoCheckUpdates = useSettingsStore((s) => s.setAutoCheckUpdates);
  const migrateWellness = useWellnessStore((s) => s._migrate as () => void);

  const [showChangelog, setShowChangelog] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // v4.0 Migration: Scrub emojis on load
  useEffect(() => {
    if (migrateWellness) migrateWellness();
  }, [migrateWellness]);

  const currentVersion = useMemo(() => Constants.expoConfig?.version || '1.0.0', []);

  const handleUpdateName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleExportBugReport = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      await logRuntimeEvent('settings_export_bug_report_start');
      const positivity = usePositivityStore.getState();
      const session = useSessionStore.getState();
      const todo = useTodoStore.getState();
      const settings = useSettingsStore.getState();
      const runtimeLogs = await getRuntimeLogs();

      const report = [
        'Product +ive Bug Report',
        `Generated: ${new Date().toISOString()}`,
        `Version: ${currentVersion}`,
        `Theme: ${t.mode}`,
        '',
        'Session Snapshot',
        `activeRuleId: ${session.activeRuleId ?? 'none'}`,
        `phase: ${session.phase}`,
        '',
        'Positivity Snapshot',
        `weeklyScore: ${positivity.weeklyScore}`,
        `lifetimeScore: ${positivity.lifetimeScore}`,
        `weeklyStreak: ${positivity.weeklyStreak}`,
        '',
        'Todo Snapshot',
        `totalTodos: ${todo.todos.length}`,
        '',
        'Settings Snapshot',
        `userName: ${settings.userName}`,
        `autoCheckUpdates: ${settings.autoCheckUpdates}`,
        '',
        'Runtime Logs',
        ...(runtimeLogs.length
          ? runtimeLogs.map((entry) => `${entry.ts} | ${entry.event} | ${JSON.stringify(entry.payload || {})}`)
          : ['(No runtime log entries)']),
      ].join('\n');

      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
      if (!baseDir) throw new Error('No writable directory available.');

      const fileUri = `${baseDir}product-ive-bug-report-${Date.now()}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, report, { encoding: FileSystem.EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/plain', dialogTitle: 'Share bug report' });
      } else {
        Alert.alert('Bug report saved', `Saved to:\n${fileUri}`);
      }
      await logRuntimeEvent('settings_export_bug_report_success', { fileUri });
    } catch (error) {
      logRuntimeEvent('settings_export_bug_report_error', { message: error instanceof Error ? error.message : 'unknown' });
      Alert.alert('Export failed', 'Could not export bug report.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCheckUpdates = async () => {
    if (isCheckingUpdates) return;
    try {
      setIsCheckingUpdates(true);
      const updateInfo = await UpdateManager.checkForUpdates();
      if (updateInfo.isAvailable) {
        Alert.alert('Update Available', `New version (${updateInfo.latestVersion}) available.\n\n${updateInfo.releaseNotes}`, [
          { text: 'Later', style: 'cancel' },
          { text: 'Update Now', onPress: () => UpdateManager.downloadAndInstall() },
        ]);
      } else {
        Alert.alert('Up to Date', `Running latest version (${updateInfo.currentVersion}).`);
      }
    } catch (error) {
      Alert.alert('Check Failed', 'Could not check for updates.');
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.isDark ? '#000' : t.bg, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: t.surfaceLow, borderColor: t.border }]}
        >
          <ArrowLeft size={18} color={t.ink} strokeWidth={2} />
        </Pressable>
        <ThemedText variant="h3">Settings</ThemedText>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.identityCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <View style={[styles.avatarBox, { backgroundColor: t.surfaceHigh }]}>
            <UserIcon size={24} color={t.positivity} />
          </View>
          <View style={styles.nameInputContainer}>
            <TextInput
              value={tempName}
              onChangeText={setTempName}
              onFocus={() => setIsEditingName(true)}
              placeholder="Your name"
              placeholderTextColor={t.textSecondary}
              style={[styles.nameInput, { color: t.text }]}
              onSubmitEditing={handleUpdateName}
            />
            {isEditingName ? (
              <Pressable 
                onPress={handleUpdateName}
                style={[
                  styles.saveBtn, 
                  { 
                    backgroundColor: t.positivity,
                    width: 60,
                    borderRadius: 12
                  }
                ]}
              >
                <ThemedText variant="label" style={{ color: '#000', fontWeight: '800' }}>Done</ThemedText>
              </Pressable>
            ) : (
              <ChevronRight size={16} color={t.textDisabled} style={{ opacity: 0.5 }} />
            )}
          </View>
        </View>

        {/* Section: Appearance */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim} style={{ marginBottom: 4 }}>Appearance</ThemedText>
          <View style={styles.row}>
            <ThemedText variant="body" color={t.ink}>Dark Mode</ThemedText>
            <Switch
              value={t.mode === 'dark'}
              onValueChange={t.toggle}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={t.mode === 'dark' ? '#FFFFFF' : '#F2F1EE'}
            />
          </View>
        </View>

        {/* Section: Wellness */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim}>Biological Optimization</ThemedText>
          <WellnessNotificationsSection />
        </View>

        {/* Section: Hardware & Interaction */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim}>Hardware & Interaction</ThemedText>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="body" color={t.ink}>Haptic Feedback</ThemedText>
              <ThemedText variant="caption" color={t.inkDim}>Tactile physical cues</ThemedText>
            </View>
            <Switch
              value={useWellnessStore((s) => s.vibrationEnabled)}
              onValueChange={(v) => useWellnessStore.getState().setVibrationEnabled(v)}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={useWellnessStore((s) => s.vibrationEnabled) ? '#FFFFFF' : '#F2F1EE'}
            />
          </View>
        </View>

        {/* Section: System & Support */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim}>System</ThemedText>
          
          <Pressable style={styles.actionRow} onPress={handleExportBugReport}>
            <View style={styles.actionLeft}>
              <Bug size={18} color={t.inkMid} />
              <ThemedText variant="body">Diagnostics</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {isExporting ? <ActivityIndicator size="small" /> : <ThemedText variant="caption" color={t.inkDim}>Export Logs</ThemedText>}
              <ChevronRight size={16} color={t.inkDim} style={{ opacity: 0.3 }} />
            </View>
          </Pressable>

          <Pressable style={styles.actionRow} onPress={handleCheckUpdates}>
            <View style={styles.actionLeft}>
              <Download size={18} color={t.inkMid} />
              <ThemedText variant="body">Software Update</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {!isCheckingUpdates && (
                <>
                  <ThemedText variant="caption" color={t.inkDim}>Latest</ThemedText>
                  <ChevronRight size={16} color={t.inkDim} style={{ opacity: 0.3 }} />
                </>
              )}
              {isCheckingUpdates && <ActivityIndicator size="small" />}
            </View>
          </Pressable>

          <Pressable style={styles.actionRow} onPress={() => setShowChangelog(!showChangelog)}>
            <View style={styles.actionLeft}>
              <CircleAlert size={18} color={t.inkMid} />
              <ThemedText variant="body">What&apos;s New</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ThemedText variant="caption" color={t.inkDim}>History</ThemedText>
              <ChevronRight size={16} color={t.inkDim} style={{ transform: [{ rotate: showChangelog ? '90deg' : '0deg' }], opacity: 0.3 }} />
            </View>
          </Pressable>

          {showChangelog && (
            <View style={[styles.expandBox, { backgroundColor: t.surfaceLow }]}>
              {CURRENT_VERSION_CHANGES.map((txt, i) => (
                <ThemedText key={i} variant="caption" style={{ marginBottom: 4 }}>• {txt}</ThemedText>
              ))}
            </View>
          )}

          <Pressable style={styles.actionRow} onPress={() => setShowAbout(!showAbout)}>
            <View style={styles.actionLeft}>
              <Info size={18} color={t.inkMid} />
              <ThemedText variant="body">Protocol Details</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ThemedText variant="caption" color={t.inkDim}>About</ThemedText>
              <ChevronRight size={16} color={t.inkDim} style={{ transform: [{ rotate: showAbout ? '90deg' : '0deg' }], opacity: 0.3 }} />
            </View>
          </Pressable>

          {showAbout && (
            <View style={[styles.expandBox, { backgroundColor: t.surfaceLow }]}>
              <ThemedText variant="body" style={{ fontWeight: '700' }}>Productive+</ThemedText>
              <ThemedText variant="caption">Rules and habits designed for cognitive excellence.</ThemedText>
              <ThemedText variant="caption" style={{ marginTop: 8 }}>Created by Aadarsh Lokhande</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <ThemedText variant="caption" color={t.textDisabled} align="center">
            VERSION {currentVersion}
          </ThemedText>
          <ThemedText variant="caption" color={t.textDisabled} align="center" style={{ marginTop: 4, letterSpacing: 1 }}>
             PRISTINE PRECISION • v4.4.0
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBtnPlaceholder: { width: 40 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  sectionCard: {
    padding: 16,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expandBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 16,
  },
  notificationInner: {
    paddingVertical: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  identityCard: {
    padding: 16,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    gap: 8,
  },
  nameInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    paddingVertical: 8,
  },
  saveBtn: {
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  notificationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  }
});
