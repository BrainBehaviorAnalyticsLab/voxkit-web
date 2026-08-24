"use client";
import { Download, AlertTriangle } from "lucide-react";
import { AppleIcon, WindowsIcon, LinuxIcon } from "./OSIcons";
import { PRE_RELEASE_DISCLAIMER } from "../lib/fakeReleases";
import { INSTALL_STEPS } from "../data/install-content";
import GridButton from "./GridButton";
import StepPanel, { type StepState } from "./StepPanel";
import { getOSDisplayName, type OS } from "../lib/os";
import type {
  ReleaseAsset,
  GroupedReleases,
  OperatingSystem,
  LatestRelease,
} from "../types/releases";

type DownloadPanelProps = StepState & {
  releases: GroupedReleases;
  /** ISO timestamp of the server render that produced `releases`, if it succeeded. */
  lastUpdated: string | null;
  /** Why the release lookup failed, when it did. Replaces the release card. */
  error: string | null;
  /** OS whose release the panel is showing. */
  selectedOS: OS;
  /** OS sniffed from the user agent, badged as "Detected" on its tile. */
  detectedOS: OS;
  onSelectOS: (os: OperatingSystem) => void;
  /** Taking a build completes this step, so the flow can move the visitor on. */
  onDownloaded: () => void;
};

/** Left-to-right order of the OS tiles. */
const OS_DISPLAY_ORDER = ["macos", "windows", "linux"] as const;

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

const isPreReleaseVersion = (version: string): boolean => {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return false;
  const major = parseInt(match[1], 10);
  return major < 1;
};

/**
 * Second step: pick an operating system and take the build for it.
 *
 * Controlled rather than self-contained. The OS selection also drives the
 * install steps in the step below, so it is owned by `InstallFlowClient`.
 */
export default function DownloadPanel({
  releases,
  lastUpdated,
  error,
  selectedOS,
  detectedOS,
  onSelectOS,
  onDownloaded,
  ...stepState
}: DownloadPanelProps) {
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

  // Taking the build is the completion signal for this step. Advancing here as
  // well as on the connector below means the common path -- click Download,
  // look up, wonder what now -- lands on the install instructions unprompted.
  const handleDownload = (asset: ReleaseAsset) => {
    if (asset?.url) {
      window.open(asset.url, "_blank");
      onDownloaded();
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const currentRelease: LatestRelease | undefined = selectedOS
    ? releases[selectedOS]
    : undefined;
  const availableOSes = Object.keys(releases);
  const hasPreReleaseVersion =
    !!currentRelease &&
    (currentRelease.prerelease || isPreReleaseVersion(currentRelease.version));
  const bestAsset = currentRelease
    ? selectBestAsset(currentRelease.assets, selectedOS)
    : null;

  return (
    <StepPanel {...stepState} step={INSTALL_STEPS.download}>
      {/* OS Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {OS_DISPLAY_ORDER.map((os) => {
          const isSelected = selectedOS === os;
          const isDetected = detectedOS === os;
          const isAvailable = availableOSes.includes(os);

          return (
            <GridButton
              key={os}
              onClick={() => onSelectOS(os)}
              disabled={!isAvailable}
              aria-pressed={isSelected}
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
                  <div className="text-xs text-red-400 mt-1">Not Available</div>
                )}
              </div>
            </GridButton>
          );
        })}
      </div>

      {/* Separates picking an OS from the release it resolves to, so the
          caveat lands on the build about to be downloaded. */}
      {hasPreReleaseVersion && (
        <div className="bg-amber-900/30 border border-amber-600/50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle
            className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-amber-200 text-sm">{PRE_RELEASE_DISCLAIMER}</p>
        </div>
      )}

      {/* Release Download */}
      {currentRelease ? (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1">
                {getOSDisplayName(selectedOS)} • v{currentRelease.version}
              </h3>
              <p className="text-sm text-slate-400">
                Released{" "}
                {RELEASE_DATE_FORMAT.format(
                  new Date(currentRelease.publishedAt),
                )}
              </p>
              {bestAsset && (
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {bestAsset.name} • {formatFileSize(bestAsset.size)}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {bestAsset ? (
                <GridButton
                  onClick={() => handleDownload(bestAsset)}
                  className="text-small px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
                  rippleColor="rgba(255, 255, 255, 0.5)"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
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
        <div
          className={`bg-slate-700/30 border border-slate-600 rounded-lg p-4 text-center ${
            error ? "text-red-400" : "text-slate-400"
          }`}
        >
          {error ??
            `No release available for ${getOSDisplayName(selectedOS) || "this OS"}.`}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-slate-600 text-sm text-slate-400 leading-relaxed">
        {lastUpdated &&
          `Last updated ${LAST_UPDATED_FORMAT.format(new Date(lastUpdated))} UTC. `}
        <a
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || "owner"}/${process.env.NEXT_PUBLIC_GITHUB_REPO || "repo"}/releases`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline"
        >
          View all releases on GitHub
        </a>
        .
      </div>
    </StepPanel>
  );
}
