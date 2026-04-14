import { useEffect, useState } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { AppleIcon, WindowsIcon, LinuxIcon } from "./OSIcons";
import { PRE_RELEASE_DISCLAIMER } from "../lib/fakeReleases";
import GridButton from "./GridButton";
import type {
  ReleaseAsset,
  ReleasesAPIResponse,
  OperatingSystem,
} from "../types/releases";

type OS = OperatingSystem | null;

const detectOS = (): OS => {
  if (typeof window === "undefined") return null;
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  return null;
};

// Check if a version string is below 1.0.0
const isPreReleaseVersion = (version: string): boolean => {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return false;
  const major = parseInt(match[1], 10);
  return major < 1;
};

export default function DownloadButton() {
  const [releasesData, setReleasesData] = useState<ReleasesAPIResponse | null>(null);
  const [detectedOS] = useState<OS>(detectOS);
  const [selectedOS, setSelectedOS] = useState<OS>(detectOS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="text-center text-slate-400">Loading release information...</div>
      </div>
    );
  }

  if (error || !releasesData) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="text-center text-red-400">{error || "No release data available"}</div>
      </div>
    );
  }

  const currentReleases = getReleasesForOS();
  const availableOSes = Object.keys(releasesData.releases);
  const hasPreReleaseVersion = currentReleases.some((release) =>
    isPreReleaseVersion(release.version)
  );

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
        Select your operating system and workflow
      </p>

      {/* OS Selection */}
 {/* OS Selection */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
  {(["windows", "macos", "linux"] as const).map((os) => {
    const isSelected = selectedOS === os;
    const isDetected = detectedOS === os;
    const isAvailable = availableOSes.includes(os);

    return (
      <GridButton
        key={os}
        onClick={() => setSelectedOS(os)}
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
          <div className="font-semibold">
            {getOSDisplayName(os)}
          </div>
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

      {/* Workflow Downloads */}
{currentReleases.map((release) => {
  const bestAsset = selectBestAsset(release.assets, selectedOS);
  
  return (
    <div
      key={release.workflow}
      className="bg-slate-700/30 border border-slate-600 rounded-lg p-4"
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
            <GridButton
  onClick={() => handleDownload(bestAsset)}
  className="text-small px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
  rippleColor='rgba(255, 255, 255, 0.5)'
  
>
  <Download className="w-4 h-4" />
  Download
</GridButton >
          ) : (
            <span className="text-slate-400 text-sm px-6 py-2">No assets</span>
          )}
            <GridButton
            onClick={() => {
              window.open(
              `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || 'owner'}/${process.env.NEXT_PUBLIC_GITHUB_REPO || 'repo'}/releases/tag/${release.tag}`,
              "_blank"
              );
            }}
            className="text-small px-8 py-4 rounded-lg text-cyan-400 border-cyan-400"
            >
            View Release
            </GridButton>
        </div>
      </div>
    </div>
  );
})}

      {/* Footer */}
      <div className="mt-8 text-center border-t border-slate-600 pt-6">
        <p className="text-slate-400 text-sm">
          Last updated: {new Date(releasesData.lastUpdated).toLocaleString()}
        </p>
        <a
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_OWNER || 'owner'}/${process.env.NEXT_PUBLIC_GITHUB_REPO || 'repo'}/releases`}
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
