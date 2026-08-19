import type {
  GitHubAsset,
  GitHubRelease,
  GroupedReleases,
  LatestRelease,
  OperatingSystem,
  ReleaseAsset,
  ReleasesAPIResponse,
} from "../types/releases";
import { fakeGitHubReleases } from "./fakeReleases";

/**
 * Server-side resolution of the latest VoxKit release per OS.
 *
 * This runs during render (see `components/DownloadButton.tsx`), not in the
 * browser, so a visitor never pays for a GitHub round trip and the download
 * panel ships fully populated in the initial HTML.
 */

/** Cache tag on the GitHub fetch. Purged nightly by `/api/revalidate-releases`. */
export const RELEASES_CACHE_TAG = "releases";

/**
 * Fallback TTL for the tag above. The nightly cron is what normally refreshes
 * the data; this keeps the site from serving indefinitely stale releases if
 * the cron ever stops firing.
 */
export const RELEASES_REVALIDATE_SECONDS = 60 * 60 * 24;

const OS_EXTENSIONS: Record<OperatingSystem, RegExp> = {
  macos: /\.(dmg|pkg)$/i,
  windows: /\.(exe|msi)$/i,
  linux: /\.(AppImage|deb|rpm)$/i,
};

function detectAssetOS(name: string): OperatingSystem | null {
  for (const os of Object.keys(OS_EXTENSIONS) as OperatingSystem[]) {
    if (OS_EXTENSIONS[os].test(name)) return os;
  }
  return null;
}

function parseVersion(tag: string): string | null {
  const match = tag.match(/^v?(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

function toReleaseAsset(asset: GitHubAsset): ReleaseAsset {
  return {
    name: asset.name,
    url: asset.browser_download_url,
    size: asset.size,
  };
}

/** Reduces the full release list to the newest release carrying assets per OS. */
export function groupReleasesByOS(releases: GitHubRelease[]): GroupedReleases {
  const grouped: GroupedReleases = {};

  for (const release of releases) {
    if (release.draft) continue;
    const version = parseVersion(release.tag_name);
    if (!version) continue;

    const byOS: Partial<Record<OperatingSystem, ReleaseAsset[]>> = {};
    for (const asset of release.assets) {
      const os = detectAssetOS(asset.name);
      if (!os) continue;
      (byOS[os] ??= []).push(toReleaseAsset(asset));
    }

    for (const os of Object.keys(byOS) as OperatingSystem[]) {
      const assets = byOS[os]!;
      const current = grouped[os];
      if (!current || compareVersions(version, current.version) > 0) {
        const next: LatestRelease = {
          version,
          tag: release.tag_name,
          publishedAt: release.published_at,
          htmlUrl: release.html_url,
          prerelease: release.prerelease,
          assets,
        };
        grouped[os] = next;
      }
    }
  }

  return grouped;
}

export type ReleasesResult =
  | { ok: true; data: ReleasesAPIResponse }
  | { ok: false; error: string };

async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
  if (process.env.USE_FAKE_RELEASES === "true") return fakeGitHubReleases;

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!owner || !repo) {
    throw new Error("GITHUB_OWNER or GITHUB_REPO is not configured");
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: {
        revalidate: RELEASES_REVALIDATE_SECONDS,
        tags: [RELEASES_CACHE_TAG],
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("GitHub API error:", response.status, errorText);
    throw new Error(`Failed to fetch releases from GitHub: ${response.status}`);
  }

  return response.json();
}

/**
 * Never throws. A GitHub outage must not fail the build or blank the download
 * page, so the failure is returned for the caller to render. On an already
 * prerendered page, a failed background revalidation leaves the last good
 * render in place and visitors see nothing at all.
 */
export async function getReleases(): Promise<ReleasesResult> {
  try {
    const releases = await fetchGitHubReleases();

    const data: ReleasesAPIResponse = {
      releases: groupReleasesByOS(releases),
      lastUpdated: new Date().toISOString(),
    };

    return { ok: true, data };
  } catch (error) {
    console.error("Error fetching releases:", error);
    return { ok: false, error: "Unable to load release information" };
  }
}
