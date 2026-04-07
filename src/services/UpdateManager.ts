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
  downloadUrl?: string;
  assetName?: string;
}

const UPDATES_CHECK_KEY = 'last_updates_check';
const UPDATE_INFO_KEY = 'cached_update_info';
const CHECK_INTERVAL_HOURS = 24;
const RELEASES_API_URL = 'https://api.github.com/repos/Aadarsh-Lokhande/Productive-Plus/releases/latest';

interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
  size?: number;
}

interface GitHubReleaseResponse {
  tag_name: string;
  body?: string;
  published_at?: string;
  assets?: GitHubReleaseAsset[];
}

function sanitizeVersion(version: string): [number, number, number] {
  const [major = '0', minor = '0', patch = '0'] = version
    .replace(/^v/i, '')
    .split(/[.-]/)
    .slice(0, 3);
  return [major, minor, patch].map((part) => {
    const parsed = parseInt(part, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }) as [number, number, number];
}

function isRemoteVersionNewer(remote: string, local: string): boolean {
  const [rMajor, rMinor, rPatch] = sanitizeVersion(remote);
  const [lMajor, lMinor, lPatch] = sanitizeVersion(local);

  if (rMajor !== lMajor) return rMajor > lMajor;
  if (rMinor !== lMinor) return rMinor > lMinor;
  return rPatch > lPatch;
}

function selectApkAsset(assets: GitHubReleaseAsset[] = []) {
  const apkAssets = assets.filter((asset) => asset.name.toLowerCase().endsWith('.apk'));
  if (apkAssets.length === 0) return undefined;
  return (
    apkAssets.find((asset) => /release/i.test(asset.name)) ??
    apkAssets[0]
  );
}

/**
 * Update Manager for Product +ive
 * Handles checking for updates and managing installation
 * 
 * Note: This uses Expo managed updates for OTA (Over-The-Air) updates.
 * For Android APK updates (native builds), use the native module integration below.
 */
class UpdateManager {
  /**
   * Checks GitHub releases and caches the result.
   */
  static async checkForUpdates(force = false): Promise<UpdateInfo> {
    try {
      const lastCheck = await AsyncStorage.getItem(UPDATES_CHECK_KEY);
      const now = Date.now();
      const currentVersion = Constants.expoConfig?.version || '1.0.0';

      if (!force && lastCheck) {
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

      const response = await fetch(RELEASES_API_URL, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!response.ok) {
        throw new Error('GitHub API request failed');
      }

      const latestRelease = (await response.json()) as GitHubReleaseResponse;
      const latestVersion = (latestRelease.tag_name || currentVersion).replace(/^v/i, '');
      const isAvailable = isRemoteVersionNewer(latestVersion, currentVersion);
      const apkAsset = selectApkAsset(latestRelease.assets);

      const updateInfo: UpdateInfo = {
        isAvailable,
        currentVersion,
        latestVersion,
        releaseNotes: latestRelease.body || 'New version available with improvements and fixes.',
        releaseDate: latestRelease.published_at,
        downloadUrl: apkAsset?.browser_download_url,
        downloadSize: apkAsset?.size,
        assetName: apkAsset?.name,
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
   * Downloads and opens the latest APK installer for Android builds.
   */
  static async downloadAndInstall(updateInfo?: UpdateInfo): Promise<void> {
    const info = updateInfo || await this.checkForUpdates(true);
    if (!info.isAvailable) {
      throw new Error('No update available.');
    }
    if (!info.downloadUrl) {
      throw new Error('Latest release does not include an APK asset.');
    }
    await this.downloadAndInstallAPK(info.downloadUrl);
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

      // For production fallback in Expo-managed flow: hand off APK to OS installer.
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
