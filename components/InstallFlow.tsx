import { getReleases } from "../lib/releases";
import InstallFlowClient from "./InstallFlowClient";

/**
 * Server component. Resolves release data during render so the download step
 * arrives fully populated in the initial HTML: no client fetch, no loading
 * flash, and the version numbers are visible to crawlers even while the step
 * sits collapsed behind the requirements gate.
 *
 * Freshness is controlled by the page's `revalidate` plus the nightly cron in
 * `app/api/revalidate-releases/route.ts`, not by this component.
 *
 * A GitHub outage costs the download links, not the page: the failure is passed
 * down as `error` so the flow still renders all three steps and the install
 * instructions stay readable.
 */
export default async function InstallFlow() {
  const result = await getReleases();

  return result.ok ? (
    <InstallFlowClient
      releases={result.data.releases}
      lastUpdated={result.data.lastUpdated}
      error={null}
    />
  ) : (
    <InstallFlowClient releases={{}} lastUpdated={null} error={result.error} />
  );
}
