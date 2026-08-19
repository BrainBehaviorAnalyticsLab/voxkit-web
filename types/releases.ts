/**
 * Types for the VoxKit download system
 * These types are shared between the API and components
 */

// GitHub API Response Types
export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
  body: string;
  html_url: string;
}

// Parsed Release Types
export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface LatestRelease {
  version: string;
  tag: string;
  publishedAt: string;
  htmlUrl: string;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

// UI Types
export type OperatingSystem = "windows" | "macos" | "linux";

export type GroupedReleases = Partial<Record<OperatingSystem, LatestRelease>>;

export interface ReleasesAPIResponse {
  releases: GroupedReleases;
  lastUpdated: string;
}

export interface DownloadPanelProps {
  className?: string;
}
