"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { AppleIcon, WindowsIcon, LinuxIcon } from "./OSIcons";

interface Asset {
  name: string;
  url: string;
  size: number;
}

interface ReleaseData {
  tag: string;
  name: string;
  publishedAt: string;
  assets: Asset[];
}

type OS = "windows" | "macos" | "linux" | null;

export default function DownloadButton() {
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
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
    fetch("/api/latest-release")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch release");
        return res.json();
      })
      .then((data) => {
        setReleaseData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load release information");
        setLoading(false);
      });
  }, []);

  // Match asset to OS
  const getAssetForOS = (os: OS): Asset | null => {
    if (!releaseData?.assets || !os) return null;

    // Common naming patterns for different OS releases
    const patterns = {
      windows: /windows|win64|win32|\.exe$/i,
      macos: /macos|darwin|osx|\.dmg$|\.pkg$/i,
      linux: /linux|\.AppImage$|\.deb$|\.rpm$/i,
    };

    const pattern = patterns[os];
    return releaseData.assets.find((asset) => pattern.test(asset.name)) || null;
  };

  const handleDownload = () => {
    const asset = getAssetForOS(selectedOS);
    if (asset?.url) {
      window.open(asset.url, "_blank");
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
        <div className="text-center text-slate-400">Loading release information...</div>
      </div>
    );
  }

  if (error || !releaseData) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
        <div className="text-center text-red-400">{error || "No release data available"}</div>
      </div>
    );
  }

  const currentAsset = getAssetForOS(selectedOS);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl shadow-black/20">
      <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2 text-white">
        <Download className="w-6 h-6 text-cyan-400" />
        Download VoxKit
      </h3>
      <p className="text-center text-slate-400 mb-6 text-sm">
        {releaseData.tag} • Released {new Date(releaseData.publishedAt).toLocaleDateString()}
      </p>

      {/* OS Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(["windows", "macos", "linux"] as const).map((os) => {
          const asset = getAssetForOS(os);
          const isSelected = selectedOS === os;
          const isDetected = detectedOS === os;
          const isAvailable = !!asset;

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
                {os === "macos" ? "macOS" : os === "windows" ? "Windows" : "Linux"}
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

      {/* Download Button */}
      {currentAsset ? (
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download for {selectedOS === "macos" ? "macOS" : selectedOS === "windows" ? "Windows" : "Linux"}
          </button>
          <div className="text-center text-slate-400 text-sm">
            {currentAsset.name} • {formatFileSize(currentAsset.size)}
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-400 py-4">
          No download available for {selectedOS}. Please select another platform.
        </div>
      )}

      {/* All Downloads Link */}
      <div className="mt-6 text-center">
        <a
          href={`https://github.com/BeckettFrey/voxkit-web/releases/tag/${releaseData.tag}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 text-sm underline"
        >
          View all downloads and release notes
        </a>
      </div>
    </div>
  );
}
