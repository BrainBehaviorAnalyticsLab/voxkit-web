import { getReleases } from "../lib/releases";
import DownloadButtonClient from "./DownloadButtonClient";

/**
 * Server component. Resolves release data during render so the panel arrives
 * fully populated in the initial HTML: no client fetch, no loading flash, and
 * the version numbers are visible to crawlers.
 *
 * Freshness is controlled by the page's `revalidate` plus the nightly cron in
 * `app/api/revalidate-releases/route.ts`, not by this component.
 */
export default async function DownloadPanel() {
  const result = await getReleases();

  if (!result.ok) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="text-center text-red-400">{result.error}</div>
      </div>
    );
  }

  return (
    <DownloadButtonClient
      releases={result.data.releases}
      lastUpdated={result.data.lastUpdated}
    />
  );
}
