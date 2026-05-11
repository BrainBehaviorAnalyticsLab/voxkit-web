import { NextResponse } from 'next/server';
import type {
  GitHubRelease,
  GitHubAsset,
  GroupedReleases,
  LatestRelease,
  OperatingSystem,
  ReleaseAsset,
  ReleasesAPIResponse,
} from '../../../types/releases';
import { fakeGitHubReleases } from '../../../lib/fakeReleases';

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
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
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

export async function GET() {
  try {
    let releases: GitHubRelease[];

    if (process.env.USE_FAKE_RELEASES === 'true') {
      releases = fakeGitHubReleases;
    } else {
      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;

      if (!owner || !repo) {
        return NextResponse.json(
          { error: 'GITHUB_OWNER or GITHUB_REPO is not configured' },
          { status: 500 }
        );
      }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          next: { revalidate: 5000 },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API error:', response.status, errorText);
        return NextResponse.json(
          { error: `Failed to fetch releases from GitHub: ${response.status}` },
          { status: response.status }
        );
      }

      releases = await response.json();
    }

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

    const apiResponse: ReleasesAPIResponse = {
      releases: grouped,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error fetching releases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
