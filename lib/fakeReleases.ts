import type { GitHubRelease } from '../types/releases';

/**
 * Fake release data for local development
 * Used when USE_FAKE_RELEASES=true
 */

/**
 * Disclaimer for pre-1.0.0 versions.
 * Should be displayed when users download or view releases with version < 1.0.0.
 */
export const PRE_RELEASE_DISCLAIMER =
  'Versions below 1.0.0 are pre-release; these are provided as-is and should be used at your own risk. ' +
  'No warranties or guarantees are provided for pre-release software.';
export const fakeGitHubReleases: GitHubRelease[] = [
  // macOS releases
  {
    tag_name: 'v0.2.0-macos-stable',
    name: 'VoxKit v1.2.0 macOS Stable',
    published_at: '2026-02-28T10:00:00Z',
    draft: false,
    prerelease: false,
    html_url: 'https://github.com/voxkit/voxkit/releases/tag/v1.2.0-macos-stable',
    body: 'Stable release for macOS with performance improvements.',
    assets: [
      {
        name: 'VoxKit-1.2.0-arm64.dmg',
        browser_download_url: 'https://example.com/VoxKit-1.2.0-arm64.dmg',
        size: 85_000_000,
        content_type: 'application/x-apple-diskimage',
        created_at: '2026-02-28T10:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
      },
      {
        name: 'VoxKit-1.2.0-x64.dmg',
        browser_download_url: 'https://example.com/VoxKit-1.2.0-x64.dmg',
        size: 88_000_000,
        content_type: 'application/x-apple-diskimage',
        created_at: '2026-02-28T10:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
      },
    ],
  },
  {
    tag_name: 'v1.3.0-macos-nightly',
    name: 'VoxKit v1.3.0 macOS Nightly',
    published_at: '2026-03-01T08:00:00Z',
    draft: false,
    prerelease: true,
    html_url: 'https://github.com/voxkit/voxkit/releases/tag/v1.3.0-macos-nightly',
    body: 'Nightly build with experimental features.',
    assets: [
      {
        name: 'VoxKit-1.3.0-arm64.dmg',
        browser_download_url: 'https://example.com/VoxKit-1.3.0-arm64.dmg',
        size: 87_000_000,
        content_type: 'application/x-apple-diskimage',
        created_at: '2026-03-01T08:00:00Z',
        updated_at: '2026-03-01T08:00:00Z',
      },
    ],
  },
  // Windows releases
  {
    tag_name: 'v1.2.0-windows-stable',
    name: 'VoxKit v1.2.0 Windows Stable',
    published_at: '2026-02-28T10:00:00Z',
    draft: false,
    prerelease: false,
    html_url: 'https://github.com/voxkit/voxkit/releases/tag/v1.2.0-windows-stable',
    body: 'Stable release for Windows.',
    assets: [
      {
        name: 'VoxKit-1.2.0-x64.exe',
        browser_download_url: 'https://example.com/VoxKit-1.2.0-x64.exe',
        size: 75_000_000,
        content_type: 'application/x-msdownload',
        created_at: '2026-02-28T10:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
      },
      {
        name: 'VoxKit-1.2.0-x64.msi',
        browser_download_url: 'https://example.com/VoxKit-1.2.0-x64.msi',
        size: 76_000_000,
        content_type: 'application/x-msi',
        created_at: '2026-02-28T10:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
      },
    ],
  },
  {
    tag_name: 'v1.1.0-windows-stable',
    name: 'VoxKit v1.1.0 Windows Stable',
    published_at: '2026-02-15T10:00:00Z',
    draft: false,
    prerelease: false,
    html_url: 'https://github.com/voxkit/voxkit/releases/tag/v1.1.0-windows-stable',
    body: 'Previous stable release.',
    assets: [
      {
        name: 'VoxKit-1.1.0-x64.exe',
        browser_download_url: 'https://example.com/VoxKit-1.1.0-x64.exe',
        size: 74_000_000,
        content_type: 'application/x-msdownload',
        created_at: '2026-02-15T10:00:00Z',
        updated_at: '2026-02-15T10:00:00Z',
      },
    ],
  },
  // Linux releases
  {
    tag_name: 'v1.2.0-linux-stable',
    name: 'VoxKit v1.2.0 Linux Stable',
    published_at: '2026-02-28T10:00:00Z',
    draft: false,
    prerelease: false,
    html_url: 'https://github.com/voxkit/voxkit/releases/tag/v1.2.0-linux-stable',
    body: 'Stable release for Linux.',
    assets: [
      {
        name: 'VoxKit-1.2.0-x86_64.AppImage',
        browser_download_url: 'https://example.com/VoxKit-1.2.0-x86_64.AppImage',
        size: 82_000_000,
        content_type: 'application/x-executable',
        created_at: '2026-02-28T10:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
      },
      {
        name: 'voxkit_1.2.0_amd64.deb',
        browser_download_url: 'https://example.com/voxkit_1.2.0_amd64.deb',
        size: 80_000_000,
        content_type: 'application/vnd.debian.binary-package',
        created_at: '2026-02-28T10:00:00Z',
        updated_at: '2026-02-28T10:00:00Z',
      },
    ],
  },
  {
    tag_name: 'v1.2.0-linux-nightly',
    name: 'VoxKit v1.2.0 Linux Nightly',
    published_at: '2026-03-01T06:00:00Z',
    draft: false,
    prerelease: true,
    html_url: 'https://github.com/voxkit/voxkit/releases/tag/v1.2.0-linux-nightly',
    body: 'Nightly build for Linux.',
    assets: [
      {
        name: 'VoxKit-1.2.0-nightly-x86_64.AppImage',
        browser_download_url: 'https://example.com/VoxKit-1.2.0-nightly-x86_64.AppImage',
        size: 83_000_000,
        content_type: 'application/x-executable',
        created_at: '2026-03-01T06:00:00Z',
        updated_at: '2026-03-01T06:00:00Z',
      },
    ],
  },
];
