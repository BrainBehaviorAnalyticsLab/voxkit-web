"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

/** Height of the fixed navbar (`h-16`), which the open panel must clear. */
const NAVBAR_HEIGHT = 64;

/**
 * How long to keep re-aiming after a step change. The panels ease open over
 * 300ms, so the thing being centred is still growing while we centre it; this
 * runs a little past that to let the geometry settle.
 */
const CENTRE_SETTLE_MS = 420;

/**
 * Time constant for the centring follow, in milliseconds. Expressed as a decay
 * rather than a per-frame fraction so the motion is identical at 60Hz and
 * 120Hz.
 */
const CENTRE_TAU = 90;

/**
 * Scroll position that puts `element` in the middle of the strip below the
 * navbar.
 *
 * A panel taller than that strip cannot be centred without pushing its own
 * heading off the top, so those clamp to sitting just under the navbar instead.
 */
const centredScrollTop = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const strip = window.innerHeight - NAVBAR_HEIGHT;
  const slack = Math.max(0, (strip - rect.height) / 2);
  return window.scrollY + rect.top - NAVBAR_HEIGHT - slack;
};

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

  // Anchor to bring into view once the step change has actually been painted.
  // Null between navigations, which is also how the effect below knows not to
  // scroll on first render.
  const scrollTargetId = useRef<string | null>(null);

  const goToStep = (step: number) => {
    scrollTargetId.current = INSTALL_STEP_ORDER[step].id;
    setActiveStep(step);
    setFurthestStep((furthest) => Math.max(furthest, step));
  };

  /*
   * Centre the newly opened panel in the space below the navbar.
   *
   * This cannot be a `scrollIntoView`, because there is no fixed position to
   * aim at when the scroll begins. Two panels are resizing at once -- the old
   * one collapsing, the new one easing open -- so the target's height and its
   * distance down the page are both still changing. A single scroll issued at
   * the start of that, smooth or not, is aiming at geometry that will not exist
   * by the time it arrives.
   *
   * So instead of computing a destination once, this recomputes it every frame
   * and eases towards whatever it currently is. The target stops moving when
   * the panels finish, the follow converges on it, and the whole thing reads as
   * one motion rather than a scroll and an expansion happening at each other.
   *
   * Decay is time-based rather than a fixed slice per frame, so it behaves the
   * same on a 60Hz and a 120Hz display.
   */
  useEffect(() => {
    const targetId = scrollTargetId.current;
    if (!targetId) return;
    scrollTargetId.current = null;

    const element = document.getElementById(targetId);
    if (!element) return;

    if (prefersReducedMotion()) {
      window.scrollTo({ top: centredScrollTop(element), behavior: "auto" });
      return;
    }

    let frame = 0;
    let lastTime = performance.now();
    const startTime = lastTime;

    const settle = () => {
      window.scrollTo({ top: centredScrollTop(element), behavior: "auto" });
      stop();
    };

    const follow = (now: number) => {
      const elapsed = now - startTime;
      const delta = now - lastTime;
      lastTime = now;

      const target = centredScrollTop(element);
      const remaining = target - window.scrollY;

      if (elapsed >= CENTRE_SETTLE_MS || Math.abs(remaining) < 0.5) {
        settle();
        return;
      }

      window.scrollTo({
        top: window.scrollY + remaining * (1 - Math.exp(-delta / CENTRE_TAU)),
        behavior: "auto",
      });
      frame = requestAnimationFrame(follow);
    };

    // Any deliberate scroll of their own wins immediately: nothing is more
    // irritating than a page dragging the view back while you are reading it.
    // Only real input counts -- listening for `scroll` would catch this
    // component's own writes and cancel on the first frame.
    const stop = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };

    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);

    frame = requestAnimationFrame(follow);
    return stop;
  }, [activeStep]);

  const stepState = (step: number) => ({
    isActive: activeStep === step,
    isComplete: step < furthestStep,
    index: step,
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
    // The attribute is a styling hook, not state: it lets one rule in
    // globals.css flatten every transition in the flow under
    // prefers-reduced-motion, which is otherwise unreachable from utility
    // classes scattered across four panels and three connectors.
    <div data-install-flow>
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
