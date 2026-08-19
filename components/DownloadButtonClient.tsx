"use client";
import { useState, useSyncExternalStore } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { AppleIcon, WindowsIcon, LinuxIcon } from "./OSIcons";
import { PRE_RELEASE_DISCLAIMER } from "../lib/fakeReleases";
import GridButton from "./GridButton";
import type {
  ReleaseAsset,
  GroupedReleases,
  OperatingSystem,
  LatestRelease,
} from "../types/releases";

type OS = OperatingSystem | null;

type DownloadButtonClientProps = {
  releases: GroupedReleases;
  /** ISO timestamp of the server render that produced `releases`. */
  lastUpdated: string;
};

/** Left-to-right order of the OS tiles. */
const OS_DISPLAY_ORDER = ["macos", "windows", "linux"] as const;

/**
 * Which OS the panel falls back to when detection fails or the visitor's OS
 * has no build. Deliberately independent of the tile order above, so moving a
 * tile does not change what the prerendered HTML shows.
 */
const OS_FALLBACK_ORDER = ["windows", "macos", "linux"] as const;

// Dates are formatted in a fixed locale and timezone so the server render and
// the hydrated client render agree. `toLocaleDateString()` would resolve
// against the visitor's timezone and mismatch the prerendered HTML.
const RELEASE_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const LAST_UPDATED_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  dateStyle: "medium",
  timeStyle: "short",
});

const detectOS = (): OS => {
  if (typeof window === "undefined") return null;
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  return null;
};

// There is no user agent to sniff during SSR, so detection is modeled as an
// external store: React renders `null` on the server and again while
// hydrating, then re-renders with the real value. The user agent never changes
// mid-session, so there is nothing to subscribe to.
const subscribeToOS = () => () => {};
const getServerOS = (): OS => null;

const isPreReleaseVersion = (version: string): boolean => {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return false;
  const major = parseInt(match[1], 10);
  return major < 1;
};

export default function DownloadButtonClient({
  releases,
  lastUpdated,
}: DownloadButtonClientProps) {
  const detectedOS = useSyncExternalStore(subscribeToOS, detectOS, getServerOS);
  const [pickedOS, setPickedOS] = useState<OS>(null);

  // Derived rather than stored, so the server and the hydrated client agree:
  // an explicit pick wins, then the detected OS if we ship builds for it, then
  // the first OS with a release at all.
  const selectedOS: OS =
    pickedOS ??
    (detectedOS && releases[detectedOS]
      ? detectedOS
      : (OS_FALLBACK_ORDER.find((os) => releases[os]) ?? null));

  const getReleaseForOS = (): LatestRelease | undefined => {
    if (!selectedOS) return undefined;
    return releases[selectedOS];
  };

  const selectBestAsset = (
    assets: ReleaseAsset[],
    os: OS,
  ): ReleaseAsset | null => {
    if (!assets || assets.length === 0) return null;
    if (assets.length === 1) return assets[0];

    const priorities: Record<string, RegExp[]> = {
      macos: [/\.dmg$/i, /\.pkg$/i],
      windows: [/\.exe$/i, /\.msi$/i],
      linux: [/\.AppImage$/i, /\.deb$/i, /\.rpm$/i],
    };

    if (!os || !priorities[os]) return assets[0];

    for (const pattern of priorities[os]) {
      const match = assets.find((asset) => pattern.test(asset.name));
      if (match) return match;
    }

    return assets[0];
  };

  const handleDownload = (asset: ReleaseAsset) => {
    if (asset?.url) {
      window.open(asset.url, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getOSDisplayName = (os: OS) => {
    if (!os) return "";
    return os === "macos" ? "macOS" : os === "windows" ? "Windows" : "Linux";
  };

  const currentRelease = getReleaseForOS();
  const availableOSes = Object.keys(releases);
  const hasPreReleaseVersion =
    !!currentRelease &&
    (currentRelease.prerelease || isPreReleaseVersion(currentRelease.version));
  const bestAsset = currentRelease
    ? selectBestAsset(currentRelease.assets, selectedOS)
    : null;

  return (
    <>
      {hasPreReleaseVersion && (
        <div className="bg-amber-900/30 border border-amber-600/50 rounded-xl p-4 max-w-4xl mx-auto mb-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200 text-sm">{PRE_RELEASE_DISCLAIMER}</p>
        </div>
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl shadow-black/20">
        <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2 text-white">
          <Download className="w-6 h-6 text-cyan-400" />
          Download VoxKit
        </h3>
        <p className="text-center text-slate-400 mb-6 text-sm">
          Select your operating system
        </p>

        {/* OS Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {OS_DISPLAY_ORDER.map((os) => {
            const isSelected = selectedOS === os;
            const isDetected = detectedOS === os;
            const isAvailable = availableOSes.includes(os);

            return (
              <GridButton
                key={os}
                onClick={() => setPickedOS(os)}
                disabled={!isAvailable}
                className={`
                  px-6 py-4 text-sm font-medium transition-all
                  ${isAvailable ? "" : "opacity-50 cursor-not-allowed"}
                  ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-400/50"
                      : "bg-slate-700/50 text-slate-300 border border-slate-600"
                  }
                `}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center mb-2">
                    {os === "windows" && <WindowsIcon />}
                    {os === "macos" && <AppleIcon />}
                    {os === "linux" && <LinuxIcon />}
                  </div>
                  <div className="font-semibold">{getOSDisplayName(os)}</div>
                  {isDetected && (
                    <div className="text-xs text-cyan-400 mt-1">Detected</div>
                  )}
                  {!isAvailable && (
                    <div className="text-xs text-red-400 mt-1">
                      Not Available
                    </div>
                  )}
                </div>
              </GridButton>
            );
          })}
        </div>

        {/* Release Download */}
        {currentRelease ? (
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h5 className="text-lg font-semibold text-white mb-1">
                  {getOSDisplayName(selectedOS)} • v{currentRelease.version}
                </h5>
                <p className="text-sm text-slate-400">
                  Released{" "}
                  {RELEASE_DATE_FORMAT.format(
                    new Date(currentRelease.publishedAt),
                  )}
                </p>
                {bestAsset && (
                  <p className="text-xs text-slate-500 mt-1">
                    {bestAsset.name} • {formatFileSize(bestAsset.size)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {bestAsset ? (
                  <GridButton
                    onClick={() => handleDownload(bestAsset)}
                    className="text-small px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
                    rippleColor="rgba(255, 255, 255, 0.5)"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </GridButton>
                ) : (
                  <span className="text-slate-400 text-sm px-6 py-2">
                    No assets
                  </span>
                )}
                <GridButton
                  onClick={() => window.open(currentRelease.htmlUrl, "_blank")}
                  className="text-small px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
                >
                  View Release
                </GridButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center text-slate-400">
            No release available for {getOSDisplayName(selectedOS) || "this OS"}
            .
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center border-t border-slate-600 pt-6">
          <p className="text-slate-400 text-sm">
            Last updated: {LAST_UPDATED_FORMAT.format(new Date(lastUpdated))}{" "}
            UTC
          </p>
          <a
            href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || "owner"}/${process.env.NEXT_PUBLIC_GITHUB_REPO || "repo"}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 text-sm underline mt-2 inline-block"
          >
            View all releases on GitHub
          </a>
        </div>
      </div>
    </>
  );
}
