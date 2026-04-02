import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bug, CircleAlert, Info } from 'lucide-react-native';

import { useTheme } from '../src/theme/ThemeContext';
import { useSettingsStore } from '../src/store/settingsStore';
import { usePositivityStore } from '../src/store/positivityStore';
import { useSessionStore } from '../src/store/sessionStore';
import { useTodoStore } from '../src/store/todoStore';
import { getRuntimeLogs, logRuntimeEvent } from '../src/utils/runtimeLogs';

const CURRENT_VERSION_CHANGES = [
  'Android CI build reliability and performance improved.',
  'App icons and splash branding updated.',
  'Navigation and tab bar behavior polished for better UX.',
  'Typography aligned to design system fonts.',
  'Bug report export added in Settings.',
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();

  const autoCheckUpdates = useSettingsStore((s) => s.autoCheckUpdates);
  const setAutoCheckUpdates = useSettingsStore((s) => s.setAutoCheckUpdates);

  const [showChangelog, setShowChangelog] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const currentVersion = useMemo(() => Constants.expoConfig?.version || '1.0.0', []);

  const handleExportBugReport = async () => {
    if (isExporting) {
      return;
    }

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
        `pausedAt: ${session.pausedAt ?? 'none'}`,
        '',
        'Positivity Snapshot',
        `weeklyScore: ${positivity.weeklyScore}`,
        `lifetimeScore: ${positivity.lifetimeScore}`,
        `weeklyStreak: ${positivity.weeklyStreak}`,
        `currentLevel: ${positivity.currentLevel}`,
        `rulesUsedCount: ${positivity.rulesUsed.length}`,
        '',
        'Todo Snapshot',
        `totalTodos: ${todo.todos.length}`,
        `activeTodos: ${todo.todos.filter((x) => !x.completed).length}`,
        `completedTodos: ${todo.todos.filter((x) => x.completed).length}`,
        '',
        'Settings Snapshot',
        `autoCheckUpdates: ${settings.autoCheckUpdates}`,
        `notificationsEnabled: ${settings.notificationsEnabled}`,
        `soundEnabled: ${settings.soundEnabled}`,
        `hapicsEnabled: ${settings.hapicsEnabled}`,
        '',
        'Runtime Logs',
        ...(runtimeLogs.length
          ? runtimeLogs.map((entry) => `${entry.ts} | ${entry.event} | ${JSON.stringify(entry.payload || {})}`)
          : ['(No runtime log entries)']),
      ].join('\n');

      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
      if (!baseDir) {
        throw new Error('No writable directory available.');
      }

      const fileUri = `${baseDir}product-ive-bug-report-${Date.now()}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, report, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Share bug report',
        });
      } else {
        Alert.alert('Bug report saved', `Saved to:\n${fileUri}`);
      }

      await logRuntimeEvent('settings_export_bug_report_success', { fileUri });
    } catch (error) {
      await logRuntimeEvent('settings_export_bug_report_error', {
        message: error instanceof Error ? error.message : 'unknown',
      });
      Alert.alert('Export failed', 'Could not export bug report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.iconBtn,
            {
              backgroundColor: t.isDark ? 'rgba(242,241,238,0.08)' : 'rgba(13,13,13,0.06)',
              borderColor: t.border,
            },
          ]}
        >
          <ArrowLeft size={18} color={t.ink} strokeWidth={2} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]}>Settings</Text>
        <View style={styles.iconBtnPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Appearance</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: t.ink }]}>Theme</Text>
            <View style={styles.rowControl}>
              <Text style={[styles.rowValue, { color: t.inkMid }]}>{t.mode === 'dark' ? 'Dark' : 'Light'}</Text>
              <Switch
                value={t.mode === 'dark'}
                onValueChange={() => {
                  t.toggle();
                  logRuntimeEvent('settings_toggle_theme', { next: t.mode === 'dark' ? 'light' : 'dark' }).catch(
                    () => {}
                  );
                }}
                trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
                thumbColor={t.mode === 'dark' ? '#FFFFFF' : '#F2F1EE'}
              />
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Support</Text>

          <Pressable style={styles.actionRow} onPress={handleExportBugReport}>
            <View style={styles.actionLeft}>
              <Bug size={18} color={t.ink} />
              <Text style={[styles.rowLabel, { color: t.ink }]}>Report bug</Text>
            </View>
            {isExporting ? <ActivityIndicator color={t.ink} /> : <Text style={[styles.rowValue, { color: t.inkMid }]}>Export .txt</Text>}
          </Pressable>

          <Pressable style={styles.actionRow} onPress={() => setShowChangelog((prev) => !prev)}>
            <View style={styles.actionLeft}>
              <CircleAlert size={18} color={t.ink} />
              <Text style={[styles.rowLabel, { color: t.ink }]}>Changelog</Text>
            </View>
            <Text style={[styles.rowValue, { color: t.inkMid }]}>v{currentVersion}</Text>
          </Pressable>

          {showChangelog && (
            <View style={[styles.expandBox, { borderColor: t.border }]}>
              <Text style={[styles.expandTitle, { color: t.ink }]}>Current version changes</Text>
              {CURRENT_VERSION_CHANGES.map((item, index) => (
                <Text key={index} style={[styles.expandLine, { color: t.inkMid }]}>
                  {index + 1}. {item}
                </Text>
              ))}
            </View>
          )}

          <Pressable style={styles.actionRow} onPress={() => setShowAbout((prev) => !prev)}>
            <View style={styles.actionLeft}>
              <Info size={18} color={t.ink} />
              <Text style={[styles.rowLabel, { color: t.ink }]}>About</Text>
            </View>
            <Text style={[styles.rowValue, { color: t.inkMid }]}>App info</Text>
          </Pressable>

          {showAbout && (
            <View style={[styles.expandBox, { borderColor: t.border }]}>
              <Text style={[styles.expandTitle, { color: t.ink }]}>Product +ive</Text>
              <Text style={[styles.expandLine, { color: t.inkMid }]}>Version: {currentVersion}</Text>
              <Text style={[styles.expandLine, { color: t.inkMid }]}>Rules that work. Habits that last.</Text>
              <Text style={[styles.expandLine, { color: t.inkMid }]}>
                Offline-first productivity app with guided rule engines and positivity tracking.
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.sectionTitle, { color: t.ink }]}>Updater</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: t.ink }]}>Auto check updates</Text>
            <Switch
              value={autoCheckUpdates}
              onValueChange={(value) => {
                setAutoCheckUpdates(value);
                logRuntimeEvent('settings_toggle_auto_update', { value }).catch(() => {});
              }}
              trackColor={{ false: 'rgba(0,0,0,0.2)', true: t.positivity }}
              thumbColor={autoCheckUpdates ? '#FFFFFF' : '#F2F1EE'}
            />
          </View>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBtnPlaceholder: {
    width: 36,
    height: 36,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 20,
    letterSpacing: -0.2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rowLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
  },
  rowValue: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
  },
  expandBox: {
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 6,
  },
  expandTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
  },
  expandLine: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});
