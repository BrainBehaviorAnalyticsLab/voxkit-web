import type { GitHubRelease } from "../types/releases";

/**
 * Fake release data for local development. Used when USE_FAKE_RELEASES=true.
 * Mirrors the real upstream schema: plain semver tags, with 1–3 assets per
 * release covering different OSes (detected by file extension).
 */

export const PRE_RELEASE_DISCLAIMER =
  "Versions below 1.0.0 are pre-release; these are provided as-is and should be used at your own risk. " +
  "No warranties or guarantees are provided for pre-release software.";

export const fakeGitHubReleases: GitHubRelease[] = [
  {
    tag_name: "v1.3.0",
    name: "VoxKit v1.3.0",
    published_at: "2026-04-20T10:00:00Z",
    draft: false,
    prerelease: false,
    html_url:
      "https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop/releases/tag/v1.3.0",
    body: "Latest stable release.",
    assets: [
      {
        name: "VoxKit-1.3.0-arm64.dmg",
        browser_download_url: "https://example.com/VoxKit-1.3.0-arm64.dmg",
        size: 85_000_000,
        content_type: "application/x-apple-diskimage",
        created_at: "2026-04-20T10:00:00Z",
        updated_at: "2026-04-20T10:00:00Z",
      },
      {
        name: "VoxKit-1.3.0-x64.exe",
        browser_download_url: "https://example.com/VoxKit-1.3.0-x64.exe",
        size: 75_000_000,
        content_type: "application/x-msdownload",
        created_at: "2026-04-20T10:00:00Z",
        updated_at: "2026-04-20T10:00:00Z",
      },
    ],
  },
  {
    tag_name: "v1.2.0",
    name: "VoxKit v1.2.0",
    published_at: "2026-02-28T10:00:00Z",
    draft: false,
    prerelease: false,
    html_url:
      "https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop/releases/tag/v1.2.0",
    body: "Previous stable release.",
    assets: [
      {
        name: "VoxKit-1.2.0-arm64.dmg",
        browser_download_url: "https://example.com/VoxKit-1.2.0-arm64.dmg",
        size: 84_000_000,
        content_type: "application/x-apple-diskimage",
        created_at: "2026-02-28T10:00:00Z",
        updated_at: "2026-02-28T10:00:00Z",
      },
      {
        name: "VoxKit-1.2.0-x64.exe",
        browser_download_url: "https://example.com/VoxKit-1.2.0-x64.exe",
        size: 74_000_000,
        content_type: "application/x-msdownload",
        created_at: "2026-02-28T10:00:00Z",
        updated_at: "2026-02-28T10:00:00Z",
      },
      {
        name: "VoxKit-1.2.0-x86_64.AppImage",
        browser_download_url:
          "https://example.com/VoxKit-1.2.0-x86_64.AppImage",
        size: 82_000_000,
        content_type: "application/x-executable",
        created_at: "2026-02-28T10:00:00Z",
        updated_at: "2026-02-28T10:00:00Z",
      },
    ],
  },
  {
    tag_name: "v0.9.0",
    name: "VoxKit v0.9.0",
    published_at: "2026-01-10T10:00:00Z",
    draft: false,
    prerelease: true,
    html_url:
      "https://github.com/BrainBehaviorAnalyticsLab/voxkit-desktop/releases/tag/v0.9.0",
    body: "Early preview.",
    assets: [
      {
        name: "voxkit_0.9.0_amd64.deb",
        browser_download_url: "https://example.com/voxkit_0.9.0_amd64.deb",
        size: 80_000_000,
        content_type: "application/vnd.debian.binary-package",
        created_at: "2026-01-10T10:00:00Z",
        updated_at: "2026-01-10T10:00:00Z",
      },
    ],
  },
];
