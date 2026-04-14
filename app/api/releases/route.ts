import { NextResponse } from 'next/server';
import type {
  GitHubRelease,
  ParsedTag,
  GroupedReleases,
  ReleasesAPIResponse,
} from '../../../types/releases';
import { fakeGitHubReleases } from '../../../lib/fakeReleases';

// Parse tag format: vX.X.X-OS-WORKFLOW
function parseTag(tag: string): ParsedTag | null {
  // Pattern: vX.X.X-OS-WORKFLOW
  // Example: v1.2.3-macos-workflow1
  const pattern = /^v(\d+\.\d+\.\d+)-(macos|windows|linux)-(.+)$/i;
  const match = tag.match(pattern);
  
  if (!match) {
    return null;
  }
  
  return {
    version: match[1],
    os: match[2].toLowerCase(),
    workflow: match[3],
    fullTag: tag,
  };
}

// Compare versions (simple string comparison for semver)
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

export async function GET() {
  try {
    let releases: GitHubRelease[];

    // Use fake data for local development
    if (process.env.USE_FAKE_RELEASES === 'true') {
      console.log('Using fake release data for development');
      releases = fakeGitHubReleases;
    } else {
      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;

      // Validate environment variables
      if (!owner || !repo) {
        return NextResponse.json(
          { error: 'GITHUB_OWNER or GITHUB_REPO is not configured' },
          { status: 500 }
        );
      }

      // Fetch all releases from GitHub
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
          },
          next: { revalidate: 5000 }, // Cache for about ~1 hour
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
    
    console.log(`Fetched ${releases.length} releases from GitHub.`);
    // Parse and group releases
    const groupedReleases: GroupedReleases = {};
    console.log(`Processing releases... ${JSON.stringify(releases)}`);
    for (const release of releases) {
      console.log(`Processing release: ${JSON.stringify(release)}`);

      const parsed = parseTag(release.tag_name);
      
      if (!parsed) {
        // Skip releases that don't match our pattern
        continue;
      }

      const { os, workflow, version } = parsed;

      // Initialize OS group if it doesn't exist
      if (!groupedReleases[os]) {
        groupedReleases[os] = [];
      }

      // Check if we already have this workflow for this OS
      const existingWorkflow = groupedReleases[os].find(
        (r) => r.workflow === workflow
      );

      if (!existingWorkflow) {
        // Add new workflow
        groupedReleases[os].push({
          workflow,
          version,
          tag: release.tag_name,
          publishedAt: release.published_at,
          assets: release.assets.map((asset) => ({
            name: asset.name,
            url: asset.browser_download_url,
            size: asset.size,
          })),
        });
      } else if (compareVersions(version, existingWorkflow.version) > 0) {
        // Update with newer version
        existingWorkflow.version = version;
        existingWorkflow.tag = release.tag_name;
        existingWorkflow.publishedAt = release.published_at;
        existingWorkflow.assets = release.assets.map((asset) => ({
          name: asset.name,
          url: asset.browser_download_url,
          size: asset.size,
        }));
      }
    }

    // Sort workflows within each OS by name
    for (const os in groupedReleases) {
      groupedReleases[os].sort((a, b) => a.workflow.localeCompare(b.workflow));
    }

    const apiResponse: ReleasesAPIResponse = {
      releases: groupedReleases,
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
