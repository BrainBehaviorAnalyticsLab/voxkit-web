"use client";
import { useState, useSyncExternalStore } from "react";
import RequirementsPanel from "./RequirementsPanel";
import DownloadPanel from "./DownloadPanel";
import GettingStartedPanel from "./GettingStartedPanel";
import FeedbackPanel from "./FeedbackPanel";
import StepConnector, { type ConnectorRole } from "./StepConnector";
import { detectOS, getServerOS, subscribeToOS, type OS } from "../lib/os";
import { INSTALL_STEP_ORDER } from "../data/install-content";
import type { GroupedReleases, OperatingSystem } from "../types/releases";

type InstallFlowClientProps = {
  releases: GroupedReleases;
  /** ISO timestamp of the server render that produced `releases`. */
  lastUpdated: string | null;
  /** Why the release lookup failed, when it did. */
  error: string | null;
};

// Positions in INSTALL_STEP_ORDER. Anchors and titles come from there too, so
// renaming a step cannot leave a connector announcing the old name.
const STEP_REQUIREMENTS = 0;
const STEP_DOWNLOAD = 1;
const STEP_GETTING_STARTED = 2;
const STEP_FEEDBACK = 3;

/**
 * Which OS the flow falls back to when detection fails or the visitor's OS has
 * no build. Deliberately independent of the tile order in `DownloadPanel`, so
 * moving a tile does not change what the prerendered HTML shows.
 */
const OS_FALLBACK_ORDER = ["windows", "macos", "linux"] as const;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives the installation page: which step is open, how far the visitor has
 * got, and which OS the whole flow is talking about.
 *
 * Two pieces of state, and they are not the same thing. `activeStep` is the
 * card currently open; `furthestStep` is how far the visitor has unlocked.
 * Keeping them apart is what lets someone walk back up the rail without the
 * steps below them re-locking, and what keeps the rail behind them cyan.
 *
 * Navigation is entirely the connectors' job. Exactly two are live at a time --
 * forward below the open step, back above it -- which is why this component
 * derives a role per connector from `activeStep` rather than letting each one
 * work out where it sits.
 *
 * The OS selection lives here too, because it spans two cards: the build you
 * take and the instructions for installing it. Holding it here is what keeps
 * the install steps from describing a platform you did not download.
 */
export default function InstallFlowClient({
  releases,
  lastUpdated,
  error,
}: InstallFlowClientProps) {
  const detectedOS = useSyncExternalStore(subscribeToOS, detectOS, getServerOS);
  const [pickedOS, setPickedOS] = useState<OperatingSystem | null>(null);
  const [activeStep, setActiveStep] = useState(STEP_REQUIREMENTS);
  const [furthestStep, setFurthestStep] = useState(STEP_REQUIREMENTS);

  // Derived rather than stored, so the server and the hydrated client agree:
  // an explicit pick wins, then the detected OS if we ship builds for it, then
  // the first OS with a release at all.
  const selectedOS: OS =
    pickedOS ??
    (detectedOS && releases[detectedOS]
      ? detectedOS
      : (OS_FALLBACK_ORDER.find((os) => releases[os]) ?? null));

  const goToStep = (step: number) => {
    setActiveStep(step);
    setFurthestStep((furthest) => Math.max(furthest, step));

    // Wait a frame so the panel has expanded to its real height before we
    // scroll to it; `scroll-mt-24` on the card keeps it clear of the navbar.
    requestAnimationFrame(() => {
      document.getElementById(INSTALL_STEP_ORDER[step].id)?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const stepState = (step: number) => ({
    isActive: activeStep === step,
    isComplete: step < furthestStep,
  });

  /** Props for the connector sitting between `step` and the one after it. */
  const connector = (step: number) => {
    const role: ConnectorRole =
      activeStep === step
        ? "forward"
        : activeStep === step + 1
          ? "back"
          : "none";
    const target = role === "back" ? step : step + 1;

    return {
      isComplete: furthestStep > step,
      role,
      targetTitle: INSTALL_STEP_ORDER[target].title,
      onNavigate: () => goToStep(target),
    };
  };

  return (
    <div>
      <RequirementsPanel {...stepState(STEP_REQUIREMENTS)} />
      <StepConnector {...connector(STEP_REQUIREMENTS)} />
      <DownloadPanel
        {...stepState(STEP_DOWNLOAD)}
        releases={releases}
        lastUpdated={lastUpdated}
        error={error}
        selectedOS={selectedOS}
        detectedOS={detectedOS}
        onSelectOS={setPickedOS}
        onDownloaded={() => goToStep(STEP_GETTING_STARTED)}
      />
      <StepConnector {...connector(STEP_DOWNLOAD)} />
      <GettingStartedPanel
        {...stepState(STEP_GETTING_STARTED)}
        os={selectedOS}
      />
      <StepConnector {...connector(STEP_GETTING_STARTED)} />
      <FeedbackPanel
        {...stepState(STEP_FEEDBACK)}
        os={selectedOS}
        version={(selectedOS && releases[selectedOS]?.version) || null}
      />
    </div>
  );
}
