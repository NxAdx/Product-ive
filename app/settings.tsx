import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, View, TextInput, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bug, CircleAlert, Info, Download, User as UserIcon, ChevronRight, Eye, Droplets, Accessibility, Moon } from 'lucide-react-native';
import notifee from '@notifee/react-native';

import { useTheme } from '../src/theme/ThemeContext';
import { useSettingsStore } from '../src/store/settingsStore';
import { usePositivityStore } from '../src/store/positivityStore';
import { useSessionStore } from '../src/store/sessionStore';
import { useTodoStore } from '../src/store/todoStore';
import { useWellnessStore } from '../src/store/wellnessStore';
import { getRuntimeLogs, logRuntimeEvent } from '../src/utils/runtimeLogs';
import { UpdateManager } from '../src/services/UpdateManager';
import type { UpdateInfo } from '../src/services/UpdateManager';
import { getPermissionStatus, requestNotificationPermissions as requestPerms } from '../src/services/NotificationManager';
import { ThemedText } from '../src/components/ThemedText';
import { tokens } from '../src/theme/tokens';
import { AppModal } from '../src/components/AppModal';

const CURRENT_VERSION_CHANGES = [
  'Spaced Repetition System (SRS) — Integrated SM-2 algorithm for optimized learning intervals.',
  'Active Recall Engine — Dedicated review sessions with difficulty grading for mental retention.',
  'Home Screen Widgets — Real-time XP and Streak tracking via premium Swift-UI Glance widgets.',
  'SQLite V3 Persistence — Durable storage for flashcards and session transcripts to prevent data loss.',
  'CI/CD Signing Hardening — Fully stabilized and signed production build pipeline.',
];

function WellnessNotificationsSection({ permGranted, onFixPermissions }: { permGranted: boolean; onFixPermissions: () => void }) {
  const t = useTheme();
  const notifications = useWellnessStore((s) => s.notifications);
  const setNotificationEnabled = useWellnessStore((s) => s.setNotificationEnabled);

  const groups = [
    { name: 'Vision', ids: ['blink-eye', '20-20-20'], icon: <Eye size={12} color={t.positivity} /> },
    { name: 'Hydration', ids: ['drink-water'], icon: <Droplets size={12} color={t.positivity} /> },
    { name: 'Body', ids: ['posture-check'], icon: <Accessibility size={12} color={t.positivity} /> },
    { name: 'Recovery', ids: ['sleep-time'], icon: <Moon size={12} color={t.positivity} /> },
  ];

  const [modalConfig, setModalConfig] = useState<{ visible: boolean; title: string; desc: string; triggerId?: string } | null>(null);

  const handleToggle = async (id: string, enabled: boolean) => {
    if (enabled && !permGranted) {
      const granted = await requestPerms();
      if (!granted) {
        setModalConfig({
          visible: true,
          title: 'Permission Required',
          desc: 'Notifications are disabled for Productive+. Please enable them in your system settings to use wellness reminders.'
        });
        return;
      }
    }
    setNotificationEnabled(id as any, enabled);
    logRuntimeEvent('settings_toggle_wellness_notification', { notification: id, enabled }).catch(() => {});
  };

  return (
    <View style={{ gap: 12, marginTop: 8 }}>
      {!permGranted && (
        <Pressable 
          onPress={onFixPermissions}
          style={[styles.notificationWarning, { backgroundColor: t.isDark ? 'rgba(255,165,0,0.1)' : 'rgba(255,165,0,0.05)', borderColor: t.warning }]}
        >
          <CircleAlert size={14} color={t.warning} />
          <ThemedText variant="caption" color={t.warning} style={{ marginLeft: 8, fontWeight: '700' }}>
            Notifications are Restricted
          </ThemedText>
          <ThemedText variant="caption" color={t.warning} style={{ marginLeft: 'auto', textDecorationLine: 'underline' }}>Configure</ThemedText>
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
                    trackColor={{ false: t.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', true: t.positivity }}
                    thumbColor={notification.enabled ? '#FFFFFF' : (t.isDark ? '#888' : '#fff')}
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
                            onPress={() => setModalConfig({ visible: true, title: 'Custom Trigger', desc: '', triggerId: notification.id })}
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

      <AppModal 
        visible={modalConfig?.visible || false}
        title={modalConfig?.title || ''}
        description={modalConfig?.desc || ''}
        onClose={() => setModalConfig(null)}
      >
        {modalConfig?.title === 'Custom Trigger' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
            {[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0].map(hour => (
              <Pressable
                key={hour}
                onPress={() => {
                  if (modalConfig.triggerId) {
                    useWellnessStore.getState().updateNotificationTime(modalConfig.triggerId as any, hour);
                  }
                  setModalConfig(null);
                }}
                style={[
                  styles.timePill,
                  { backgroundColor: t.surfaceLow, paddingVertical: 12, paddingHorizontal: 20 }
                ]}
              >
                <ThemedText variant="body" style={{ fontWeight: '600' }}>
                  {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </AppModal>
    </View>
  );
}

function BackgroundReliabilitySection({ onStatusUpdate }: { onStatusUpdate?: (granted: boolean) => void }) {
  const t = useTheme();
  const [isChecking, setIsChecking] = useState(false);
  const [batteryOptimizationEnabled, setBatteryOptimizationEnabled] = useState<boolean | null>(null);
  const [notificationGranted, setNotificationGranted] = useState<boolean | null>(null);
  const [modal, setModal] = useState<{ visible: boolean; title: string; desc: string } | null>(null);

  const refreshStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const permission = await getPermissionStatus();
      setNotificationGranted(permission.granted);
      if (onStatusUpdate) onStatusUpdate(permission.granted);
      if (Platform.OS === 'android') {
        const batteryOptimized = await notifee.isBatteryOptimizationEnabled();
        setBatteryOptimizationEnabled(batteryOptimized);
      } else {
        setBatteryOptimizationEnabled(null);
      }
    } catch (error) {
      setModal({
        visible: true,
        title: 'Status Check Failed',
        desc: error instanceof Error ? error.message : 'Could not read background permission status.',
      });
    } finally {
      setIsChecking(false);
    }
  }, [onStatusUpdate]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const openNotificationSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        await notifee.openNotificationSettings();
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      setModal({
        visible: true,
        title: 'Open Settings Failed',
        desc: error instanceof Error ? error.message : 'Could not open notification settings.',
      });
    }
  };

  const openBatterySettings = async () => {
    try {
      await notifee.openBatteryOptimizationSettings();
    } catch (error) {
      setModal({
        visible: true,
        title: 'Battery Settings Failed',
        desc: error instanceof Error ? error.message : 'Could not open battery optimization settings.',
      });
    }
  };

  const openPowerManagerSettings = async () => {
    try {
      await notifee.openPowerManagerSettings();
    } catch (error) {
      setModal({
        visible: true,
        title: 'Power Manager Failed',
        desc: error instanceof Error ? error.message : 'Could not open power manager settings.',
      });
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={[styles.statusRow, { backgroundColor: t.surfaceLow, borderColor: t.border }]}>
        <ThemedText variant="caption" color={t.textSecondary} style={{ flex: 1 }}>
          Notifications
        </ThemedText>
        <ThemedText
          variant="caption"
          style={{
            fontWeight: '700',
            color: notificationGranted === true ? t.positivity : notificationGranted === false ? t.warning : t.textSecondary,
          }}
        >
          {notificationGranted === true ? 'Allowed' : notificationGranted === false ? 'Restricted' : 'Unknown'}
        </ThemedText>
      </View>

      {Platform.OS === 'android' && (
        <View style={[styles.statusRow, { backgroundColor: t.surfaceLow, borderColor: t.border }]}>
          <ThemedText variant="caption" color={t.textSecondary} style={{ flex: 1 }}>
            Battery Optimization
          </ThemedText>
          <ThemedText
            variant="caption"
            style={{
              fontWeight: '700',
              color:
                batteryOptimizationEnabled === false
                  ? t.positivity
                  : batteryOptimizationEnabled === true
                    ? t.warning
                    : t.textSecondary,
            }}
          >
            {batteryOptimizationEnabled === false
              ? 'Excluded'
              : batteryOptimizationEnabled === true
                ? 'Enabled'
                : 'Unknown'}
          </ThemedText>
        </View>
      )}

      <Pressable style={styles.actionRow} onPress={openNotificationSettings}>
        <View style={styles.actionLeft}>
          <CircleAlert size={18} color={t.inkMid} />
          <ThemedText variant="body">Notification Settings</ThemedText>
        </View>
        <ChevronRight size={16} color={t.textDisabled} />
      </Pressable>

      {Platform.OS === 'android' && (
        <>
          <Pressable style={styles.actionRow} onPress={openBatterySettings}>
            <View style={styles.actionLeft}>
              <CircleAlert size={18} color={t.inkMid} />
              <ThemedText variant="body">Exclude Battery Optimization</ThemedText>
            </View>
            <ChevronRight size={16} color={t.textDisabled} />
          </Pressable>

          <Pressable style={styles.actionRow} onPress={openPowerManagerSettings}>
            <View style={styles.actionLeft}>
              <CircleAlert size={18} color={t.inkMid} />
              <ThemedText variant="body">Open Power Manager</ThemedText>
            </View>
            <ChevronRight size={16} color={t.textDisabled} />
          </Pressable>
        </>
      )}

      <Pressable style={styles.actionRow} onPress={refreshStatus} disabled={isChecking}>
        <View style={styles.actionLeft}>
          <CircleAlert size={18} color={t.inkMid} />
          <ThemedText variant="body">Refresh Status</ThemedText>
        </View>
        {isChecking ? <ActivityIndicator size="small" /> : <ChevronRight size={16} color={t.textDisabled} />}
      </Pressable>

      <AppModal
        visible={modal?.visible || false}
        title={modal?.title || ''}
        description={modal?.desc || ''}
        onClose={() => setModal(null)}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();

  const userName = useSettingsStore((s) => s.userName);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const migrateWellness = useWellnessStore((s) => s._migrate as () => void);

  const [showChangelog, setShowChangelog] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [isInstallingUpdate, setIsInstallingUpdate] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [mainModal, setMainModal] = useState<{ visible: boolean; title: string; desc: string } | null>(null);
  const [updateModal, setUpdateModal] = useState<{ visible: boolean; info: UpdateInfo | null }>({
    visible: false,
    info: null,
  });

  const [permGranted, setPermGranted] = useState(true);
  const scrollRef = React.useRef<ScrollView>(null);

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
        setMainModal({ visible: true, title: 'Bug report saved', desc: `Saved to:\n${fileUri}` });
      }
      await logRuntimeEvent('settings_export_bug_report_success', { fileUri });
    } catch (error) {
      logRuntimeEvent('settings_export_bug_report_error', { message: error instanceof Error ? error.message : 'unknown' });
      setMainModal({ visible: true, title: 'Export Failed', desc: 'Could not export bug report.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCheckUpdates = async () => {
    if (isCheckingUpdates) return;
    try {
      setIsCheckingUpdates(true);
      const updateInfo = await UpdateManager.checkForUpdates(true);
      if (updateInfo.isAvailable) {
        setUpdateModal({ visible: true, info: updateInfo });
      } else {
        setMainModal({ visible: true, title: 'Up to Date', desc: `Running latest version (${updateInfo.currentVersion}).` });
      }
    } catch {
      setMainModal({ visible: true, title: 'Check Failed', desc: 'Could not check for updates.' });
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  const scrollToReliability = () => {
    // Basic estimate of position or just scroll to end
    scrollRef.current?.scrollToEnd();
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

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
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
              <View style={{ width: 60 }} />
            )}
          </View>
        </View>

        {/* Section: Appearance */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim} style={{ marginBottom: 4 }}>Appearance</ThemedText>
          <View style={styles.row}>
            <ThemedText variant="body" color={t.ink}>Follow System Theme</ThemedText>
            <Switch
              value={t.isSystem}
              onValueChange={(enabled) => {
                t.setMode(enabled ? 'system' : t.isDark ? 'dark' : 'light').catch(() => {});
              }}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={t.isSystem ? '#FFFFFF' : '#F2F1EE'}
            />
          </View>
          <View style={[styles.row, { opacity: t.isSystem ? 0.5 : 1 }]}>
            <ThemedText variant="body" color={t.ink}>Dark Mode</ThemedText>
            <Switch
              value={t.resolvedMode === 'dark'}
              onValueChange={(enabled) => {
                t.setMode(enabled ? 'dark' : 'light').catch(() => {});
              }}
              disabled={t.isSystem}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={t.resolvedMode === 'dark' ? '#FFFFFF' : '#F2F1EE'}
            />
          </View>
          <ThemedText variant="caption" color={t.textSecondary} style={{ marginTop: 8 }}>
            {t.isSystem
              ? `Currently following system theme (${t.resolvedMode}).`
              : 'Manual theme mode selected.'}
          </ThemedText>
        </View>

        {/* Section: Wellness */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim}>Biological Optimization</ThemedText>
          <WellnessNotificationsSection permGranted={permGranted} onFixPermissions={scrollToReliability} />
        </View>

        {/* Section: Background Reliability */}
        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim}>Background Reliability</ThemedText>
          <ThemedText variant="caption" color={t.textSecondary} style={{ marginTop: 6, marginBottom: 8 }}>
            Keep sessions running reliably by granting notification and battery-related permissions.
          </ThemedText>
          <BackgroundReliabilitySection onStatusUpdate={setPermGranted} />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: t.isDark ? '#0d0d0d' : t.card, borderColor: t.border }]}>
          <ThemedText variant="label" color={t.inkDim}>Hardware & Interaction</ThemedText>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="body" color={t.ink}>Haptic Feedback</ThemedText>
              <ThemedText variant="caption" color={t.inkDim}>Tactile physical cues</ThemedText>
            </View>
            <Switch
              value={useSettingsStore((s) => s.hapticsEnabled)}
              onValueChange={(v) => useSettingsStore.getState().setHapticsEnabled(v)}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={useSettingsStore((s) => s.hapticsEnabled) ? '#FFFFFF' : '#F2F1EE'}
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
              {isExporting ? <ActivityIndicator size="small" /> : <ThemedText variant="caption" color={t.textSecondary}>Export Logs</ThemedText>}
              <ChevronRight size={16} color={t.textDisabled} />
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
                  <ThemedText variant="caption" color={t.textSecondary}>Latest</ThemedText>
                  <ChevronRight size={16} color={t.textDisabled} />
                </>
              )}
              {isCheckingUpdates && <ActivityIndicator size="small" />}
            </View>
          </Pressable>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="body" color={t.ink}>Auto-Check Updates</ThemedText>
              <ThemedText variant="caption" color={t.inkDim}>Check for new versions on app launch</ThemedText>
            </View>
            <Switch
              value={useSettingsStore((s) => s.autoCheckUpdates)}
              onValueChange={(v) => useSettingsStore.getState().setAutoCheckUpdates(v)}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={useSettingsStore((s) => s.autoCheckUpdates) ? '#FFFFFF' : '#F2F1EE'}
            />
          </View>

          <Pressable style={styles.actionRow} onPress={() => setShowChangelog(!showChangelog)}>
            <View style={styles.actionLeft}>
              <CircleAlert size={18} color={t.inkMid} />
              <ThemedText variant="body">What&apos;s New</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ThemedText variant="caption" color={t.textSecondary}>History</ThemedText>
              <ChevronRight 
                size={16} 
                color={t.textDisabled} 
                style={{ transform: [{ rotate: showChangelog ? '90deg' : '0deg' }] }} 
              />
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
              <ThemedText variant="caption" color={t.textSecondary}>About</ThemedText>
              <ChevronRight 
                size={16} 
                color={t.textDisabled} 
                style={{ transform: [{ rotate: showAbout ? '90deg' : '0deg' }] }} 
              />
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
              PRISTINE PRECISION • v1.3.1
          </ThemedText>
        </View>
      </ScrollView>

      <AppModal 
        visible={mainModal?.visible || false}
        title={mainModal?.title || ''}
        description={mainModal?.desc || ''}
        onClose={() => setMainModal(null)}
      />

      <AppModal
        visible={updateModal.visible}
        title="Update Available"
        description={
          updateModal.info
            ? `Version ${updateModal.info.latestVersion} is available.\n\n${updateModal.info.releaseNotes || 'New fixes and improvements are ready.'}`
            : ''
        }
        onClose={() => setUpdateModal({ visible: false, info: null })}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            style={[styles.modalBtn, { backgroundColor: t.surfaceHigh }]}
            onPress={() => setUpdateModal({ visible: false, info: null })}
          >
            <ThemedText variant="label" color={t.textSecondary}>Later</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.modalBtn, { backgroundColor: t.positivity, opacity: isInstallingUpdate ? 0.7 : 1 }]}
            disabled={isInstallingUpdate}
            onPress={async () => {
              if (!updateModal.info) return;
              // Phase C4: Warn if a session is actively running
              const activeSession = useSessionStore.getState().activeRuleId;
              if (activeSession) {
                setUpdateModal({ visible: false, info: null });
                setMainModal({
                  visible: true,
                  title: 'Session In Progress',
                  desc: 'A focus session is currently active. Please finish or end your session before installing an update.',
                });
                return;
              }
              try {
                setIsInstallingUpdate(true);
                await UpdateManager.downloadAndInstall(updateModal.info);
                setUpdateModal({ visible: false, info: null });
              } catch (error) {
                setMainModal({
                  visible: true,
                  title: 'Install Failed',
                  desc: error instanceof Error ? error.message : 'Unable to start update installation.',
                });
              } finally {
                setIsInstallingUpdate(false);
              }
            }}
          >
            {isInstallingUpdate ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <ThemedText variant="label" style={{ color: '#000', fontWeight: '800' }}>Update Now</ThemedText>
            )}
          </Pressable>
        </View>
      </AppModal>
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
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  }
});
