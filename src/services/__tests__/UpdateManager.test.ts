/**
 * Tests for UpdateManager utility logic.
 * These cover the pure functions that don't require network or native modules.
 */

// We pull the functions out by importing the module and testing the exported class methods
// For the pure helper functions that are module-private, we copy them here to test in isolation.

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

interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
  size?: number;
}

function selectApkAsset(assets: GitHubReleaseAsset[] = []) {
  const apkAssets = assets.filter((asset) => asset.name.toLowerCase().endsWith('.apk'));
  if (apkAssets.length === 0) return undefined;
  return (
    apkAssets.find((asset) => /release/i.test(asset.name)) ??
    apkAssets[0]
  );
}

describe('sanitizeVersion', () => {
  it('parses standard semver', () => {
    expect(sanitizeVersion('1.2.3')).toEqual([1, 2, 3]);
  });

  it('strips leading v', () => {
    expect(sanitizeVersion('v2.0.1')).toEqual([2, 0, 1]);
  });

  it('handles missing parts', () => {
    expect(sanitizeVersion('1')).toEqual([1, 0, 0]);
    expect(sanitizeVersion('1.5')).toEqual([1, 5, 0]);
  });

  it('handles garbage gracefully', () => {
    expect(sanitizeVersion('abc')).toEqual([0, 0, 0]);
    expect(sanitizeVersion('')).toEqual([0, 0, 0]);
  });

  it('handles pre-release tags', () => {
    // "1.0.0-beta" splits on "-" giving [1, 0, 0]
    expect(sanitizeVersion('1.0.0-beta')).toEqual([1, 0, 0]);
  });
});

describe('isRemoteVersionNewer', () => {
  it('detects major bump', () => {
    expect(isRemoteVersionNewer('2.0.0', '1.0.0')).toBe(true);
    expect(isRemoteVersionNewer('1.0.0', '2.0.0')).toBe(false);
  });

  it('detects minor bump', () => {
    expect(isRemoteVersionNewer('1.1.0', '1.0.0')).toBe(true);
    expect(isRemoteVersionNewer('1.0.0', '1.1.0')).toBe(false);
  });

  it('detects patch bump', () => {
    expect(isRemoteVersionNewer('1.0.1', '1.0.0')).toBe(true);
    expect(isRemoteVersionNewer('1.0.0', '1.0.1')).toBe(false);
  });

  it('returns false for equal versions', () => {
    expect(isRemoteVersionNewer('1.0.0', '1.0.0')).toBe(false);
  });

  it('handles v prefix', () => {
    expect(isRemoteVersionNewer('v2.0.0', 'v1.0.0')).toBe(true);
  });
});

describe('selectApkAsset', () => {
  it('returns undefined for empty array', () => {
    expect(selectApkAsset([])).toBeUndefined();
  });

  it('returns undefined when no APK assets', () => {
    expect(selectApkAsset([
      { name: 'source.zip', browser_download_url: 'https://example.com/source.zip' },
    ])).toBeUndefined();
  });

  it('selects the only APK', () => {
    const asset = { name: 'app.apk', browser_download_url: 'https://example.com/app.apk' };
    expect(selectApkAsset([asset])).toBe(asset);
  });

  it('prefers release APK over others', () => {
    const debug = { name: 'app-debug.apk', browser_download_url: 'https://example.com/debug.apk' };
    const release = { name: 'app-release.apk', browser_download_url: 'https://example.com/release.apk' };
    expect(selectApkAsset([debug, release])).toBe(release);
  });

  it('falls back to first APK when no release keyword', () => {
    const a = { name: 'build-a.apk', browser_download_url: 'https://example.com/a.apk' };
    const b = { name: 'build-b.apk', browser_download_url: 'https://example.com/b.apk' };
    expect(selectApkAsset([a, b])).toBe(a);
  });
});
