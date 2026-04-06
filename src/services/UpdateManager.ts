import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';

export interface UpdateInfo {
  isAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes: string;
  downloadSize?: number;
  releaseDate?: string;
}

const UPDATES_CHECK_KEY = 'last_updates_check';
const UPDATE_INFO_KEY = 'cached_update_info';
const CHECK_INTERVAL_HOURS = 24;

/**
 * Update Manager for Product +ive
 * Handles checking for updates and managing installation
 * 
 * Note: This uses Expo managed updates for OTA (Over-The-Air) updates.
 * For Android APK updates (native builds), use the native module integration below.
 */
class UpdateManager {
  /**
   * Check for available updates
   * For now, simulates update check. In production, would call a version API.
   */
  static async checkForUpdates(): Promise<UpdateInfo> {
    try {
      const lastCheck = await AsyncStorage.getItem(UPDATES_CHECK_KEY);
      const now = Date.now();
      const currentVersion = Constants.expoConfig?.version || '1.0.0';

      if (lastCheck) {
        const lastCheckTime = parseInt(lastCheck, 10);
        const hoursSinceCheck = (now - lastCheckTime) / (1000 * 60 * 60);

        if (hoursSinceCheck < CHECK_INTERVAL_HOURS) {
          const cached = await AsyncStorage.getItem(UPDATE_INFO_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.currentVersion === currentVersion) {
              return parsed;
            }
          }
        }
      }

      // Live fetch from GitHub
      const response = await fetch('https://api.github.com/repos/Aadarsh-Lokhande/Productive-Plus/releases/latest', {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!response.ok) {
        throw new Error('GitHub API request failed');
      }

      const latestRelease = await response.json();
      const latestVersion = latestRelease.tag_name.replace('v', '');
      
      // Semantic comparison: simplified - in prod we'd use a semver lib
      const isAvailable = latestVersion !== currentVersion;

      const updateInfo: UpdateInfo = {
        isAvailable,
        currentVersion,
        latestVersion,
        releaseNotes: latestRelease.body || 'New version available with improvements and fixes.',
        releaseDate: latestRelease.published_at,
      };

      await AsyncStorage.setItem(UPDATES_CHECK_KEY, now.toString());
      await AsyncStorage.setItem(UPDATE_INFO_KEY, JSON.stringify(updateInfo));

      return updateInfo;
    } catch (error) {
      console.warn('Update check failed (likely network or missing repo):', error);
      return {
        isAvailable: false,
        currentVersion: Constants.expoConfig?.version || '1.0.0',
        latestVersion: Constants.expoConfig?.version || '1.0.0',
        releaseNotes: '',
      };
    }
  }

  /**
   * Download and install a new update
   * For Expo managed service, this would trigger a reload
   * For native APK, this calls the Android updater
   */
  static async downloadAndInstall() {
    try {
      // For Expo managed: would call Updates.fetchUpdateAsync()
      // For production: would download from API and trigger install
      console.log('Update download initiated...');
      
      // Simulate download/install in development
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Update would be installed on next app restart');
          resolve(undefined);
        }, 1000);
      });
    } catch (error) {
      console.error('Update installation error:', error);
      throw error;
    }
  }

  /**
   * For native Android APK updates (when using expo prebuild + native code):
   * This would integrate with the Android PackageInstaller API
   * Call this from a native module bridge
   */
  static async downloadAndInstallAPK(apkUrl: string): Promise<void> {
    try {
      const fileName = `product-ive-update-${Date.now()}.apk`;
      const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + fileName;

      if (!fileUri) {
        throw new Error('No writable directory available');
      }

      console.log('Downloading APK from:', apkUrl);

      // Download the APK
      const download = FileSystem.createDownloadResumable(
        apkUrl,
        fileUri,
        {},
        (progress) => {
          const percentComplete = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${(percentComplete * 100).toFixed(1)}%`);
        }
      );

      const result = await download.downloadAsync();
      
      if (!result) {
        throw new Error('Download failed');
      }

      console.log('APK downloaded to:', fileUri);

      // For production: pass to native Android module for PackageInstaller API
      // For development: attempt to open with system installer
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.android.package-archive',
          dialogTitle: 'Install Product +ive Update',
        });
      }

      // Clean up after installation
      setTimeout(async () => {
        try {
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        } catch (e) {
          console.warn('Failed to clean up APK file:', e);
        }
      }, 5000);
    } catch (error) {
      console.error('APK download error:', error);
      throw error;
    }
  }

  /**
   * Clear cached update info
   */
  static async clearCache() {
    await AsyncStorage.removeItem(UPDATES_CHECK_KEY);
    await AsyncStorage.removeItem(UPDATE_INFO_KEY);
  }
}

export { UpdateManager };
