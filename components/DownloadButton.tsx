"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { AppleIcon, WindowsIcon, LinuxIcon } from "./OSIcons";
import type {
  ReleaseAsset,
  ReleaseByWorkflow,
  ReleasesAPIResponse,
  OperatingSystem,
} from "../types/releases";

type OS = OperatingSystem | null;

export default function DownloadButton() {
  const [releasesData, setReleasesData] = useState<ReleasesAPIResponse | null>(null);
  const [detectedOS, setDetectedOS] = useState<OS>(null);
  const [selectedOS, setSelectedOS] = useState<OS>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect user's OS
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    let os: OS = null;

    if (userAgent.includes("win")) {
      os = "windows";
    } else if (userAgent.includes("mac")) {
      os = "macos";
    } else if (userAgent.includes("linux")) {
      os = "linux";
    }

    setDetectedOS(os);
    setSelectedOS(os);
  }, []);

  // Fetch release data
  useEffect(() => {
    fetch("/api/releases")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch releases");
        return res.json();
      })
      .then((data: ReleasesAPIResponse) => {
        setReleasesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load release information");
        setLoading(false);
      });
  }, []);

  // Get releases for selected OS
  const getReleasesForOS = (): ReleaseByWorkflow[] => {
    if (!releasesData?.releases || !selectedOS) return [];
    return releasesData.releases[selectedOS] || [];
  };

  // Select the best asset for the platform (prefer native installers over zip files)
  const selectBestAsset = (assets: ReleaseAsset[], os: OS): ReleaseAsset | null => {
    if (!assets || assets.length === 0) return null;
    if (assets.length === 1) return assets[0];

    // Priority order for each OS
    const priorities: Record<string, RegExp[]> = {
      macos: [/\.dmg$/i, /\.pkg$/i, /\.tar\.gz$/i, /\.zip$/i],
      windows: [/\.exe$/i, /\.msi$/i, /\.zip$/i],
      linux: [/\.AppImage$/i, /\.deb$/i, /\.rpm$/i, /\.tar\.gz$/i, /\.zip$/i],
    };

    if (!os || !priorities[os]) return assets[0];

    // Find the highest priority asset
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

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl">
        <div className="text-center text-slate-400">Loading release information...</div>
      </div>
    );
  }

  if (error || !releasesData) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl">
        <div className="text-center text-red-400">{error || "No release data available"}</div>
      </div>
    );
  }

  const currentReleases = getReleasesForOS();
  const availableOSes = Object.keys(releasesData.releases);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl shadow-black/20">
      <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2 text-white">
        <Download className="w-6 h-6 text-cyan-400" />
        Download VoxKit
      </h3>
      <p className="text-center text-slate-400 mb-6 text-sm">
        Select your operating system and workflow
      </p>

      {/* OS Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {(["windows", "macos", "linux"] as const).map((os) => {
          const isSelected = selectedOS === os;
          const isDetected = detectedOS === os;
          const isAvailable = availableOSes.includes(os);

          return (
            <button
              key={os}
              onClick={() => setSelectedOS(os)}
              disabled={!isAvailable}
              className={`
                relative px-6 py-4 rounded-lg font-medium transition-all transform 
                ${isAvailable ? "hover:scale-105" : "opacity-50 cursor-not-allowed"}
                ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 border border-blue-500/20"
                    : "bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-700"
                }
              `}
            >
              <div className="flex items-center justify-center mb-2">
                {os === "windows" && <WindowsIcon />}
                {os === "macos" && <AppleIcon />}
                {os === "linux" && <LinuxIcon />}
              </div>
              <div className="text-sm font-semibold">
                {getOSDisplayName(os)}
              </div>
              {isDetected && (
                <div className="text-xs text-cyan-400 mt-1">Detected</div>
              )}
              {!isAvailable && (
                <div className="text-xs text-red-400 mt-1">Not Available</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Workflow Downloads */}
      {currentReleases.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">
            Available Downloads for {getOSDisplayName(selectedOS)}
          </h4>
          {currentReleases.map((release) => {
            const bestAsset = selectBestAsset(release.assets, selectedOS);
            
            return (
            <div
              key={release.workflow}
              className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-white mb-1">
                    {release.workflow}
                  </h5>
                  <p className="text-sm text-slate-400">
                    Version {release.version} • {new Date(release.publishedAt).toLocaleDateString()}
                  </p>
                  {bestAsset && (
                    <p className="text-xs text-slate-500 mt-1">
                      {bestAsset.name} • {formatFileSize(bestAsset.size)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {bestAsset ? (
                    <button
                      onClick={() => handleDownload(bestAsset)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  ) : (
                    <span className="text-slate-400 text-sm px-6 py-2">No assets</span>
                  )}
                  <a
                    href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || 'owner'}/${process.env.NEXT_PUBLIC_GITHUB_REPO || 'repo'}/releases/tag/${release.tag}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded-lg border border-slate-600 hover:border-cyan-500 transition-colors text-sm font-medium"
                  >
                    View Release
                  </a>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-slate-400 py-8 bg-slate-700/30 rounded-lg border border-slate-600">
          <p>No downloads available for {getOSDisplayName(selectedOS)}.</p>
          <p className="text-sm mt-2">Please select another platform.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center border-t border-slate-600 pt-6">
        <p className="text-slate-400 text-sm">
          Last updated: {new Date(releasesData.lastUpdated).toLocaleString()}
        </p>
        <a
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || 'owner'}/${process.env.NEXT_PUBLIC_GITHUB_REPO || 'repo'}/releases`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 text-sm underline mt-2 inline-block"
        >
          View all releases on GitHub
        </a>
      </div>
    </div>
  );
}
