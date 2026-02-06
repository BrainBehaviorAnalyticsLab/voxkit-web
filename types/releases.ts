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
export interface ParsedTag {
  version: string;
  os: string;
  workflow: string;
  fullTag: string;
}

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
}

export interface ReleaseByWorkflow {
  workflow: string;
  version: string;
  tag: string;
  publishedAt: string;
  assets: ReleaseAsset[];
}

export interface GroupedReleases {
  [os: string]: ReleaseByWorkflow[];
}

export interface ReleasesAPIResponse {
  releases: GroupedReleases;
  lastUpdated: string;
}

// UI Types
export type OperatingSystem = "windows" | "macos" | "linux";

export interface DownloadButtonProps {
  className?: string;
}
