import type { Metadata } from "next";
import { Footer, Navbar } from "../../layout";
import InstallFlow from "../../components/InstallFlow";

export const metadata: Metadata = {
  title: "Installation Guide",
  description:
    "Download and setup the latest version of VoxKit for macOS, Windows, or Linux. Built for speech pathology researchers, no command line required.",
};

// Fallback only: the nightly cron at /api/revalidate-releases is what normally
// refreshes this page. Keep in sync with RELEASES_REVALIDATE_SECONDS (24h) --
// Next requires a literal here, so it cannot be imported.
export const revalidate = 86400;

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar view="Installation" />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Installation Guide
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Download and setup the latest version of the app
          </p>
        </div>

        {/* The one column the three steps share. Width lives here so the
            panels stay aligned with each other rather than each choosing;
            the connectors between them supply the vertical rhythm. */}
        <div className="max-w-4xl mx-auto">
          <InstallFlow />
        </div>
      </div>
      <Footer />
    </div>
  );
}
