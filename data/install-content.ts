import type { OperatingSystem } from "../types/releases";

/**
 * The prose half of the installation page: what a machine needs to run VoxKit,
 * and what to do with the build once it lands. None of it comes from GitHub, so
 * it lives here rather than in `lib/releases.ts`.
 *
 * This is the only copy. The help centre's "Getting Started" topic used to say
 * the same things a page away, and the two drifted; it now redirects here.
 */

/** Identity of one step: its anchor, its heading, and the line beneath it. */
export type InstallStep = {
  id: string;
  title: string;
  description: string;
  /** Marked as skippable in the UI. Nothing depends on it being finished. */
  optional?: boolean;
};

/**
 * The steps, named once.
 *
 * A step's title is shown in two places -- as the panel's own heading, and as
 * the destination the connector above it announces ("Continue to ..."). Those
 * were separate strings and immediately drifted apart, so they read from here
 * instead. Renaming a step is a one-line change.
 */
export const INSTALL_STEPS = {
  requirements: {
    id: "requirements",
    title: "Check your machine",
    description:
      "Confirm your device meets these before downloading, so nothing blocks you partway through.",
  },
  download: {
    id: "download",
    title: "Download a build",
    description: "Select your operating system to get the latest build for it.",
  },
  gettingStarted: {
    id: "getting-started",
    title: "Get set up",
    description:
      "Once the download finishes, follow these steps to install VoxKit and open it for the first time.",
  },
  feedback: {
    id: "feedback",
    title: "Tell us how it went",
    description:
      "Optional, and it only takes a moment. How this install felt is the main way we find out where the process trips people up.",
    optional: true,
  },
} satisfies Record<string, InstallStep>;

/** The order they are worked through. The flow indexes into this. */
export const INSTALL_STEP_ORDER: InstallStep[] = [
  INSTALL_STEPS.requirements,
  INSTALL_STEPS.download,
  INSTALL_STEPS.gettingStarted,
  INSTALL_STEPS.feedback,
];

/** One line of the requirements table: what is measured, and the bar it must clear. */
export type SystemRequirement = {
  label: string;
  detail: string;
};

export const SYSTEM_REQUIREMENTS: SystemRequirement[] = [
  {
    label: "Operating system",
    detail:
      "macOS 26 or later, Windows 10 or later, or Linux (testing in progress)",
  },
  {
    label: "Memory",
    detail: "4 GB of RAM minimum, 8 GB recommended",
  },
  {
    label: "Disk space",
    detail: "20 GB free — models and datasets can be hefty",
  },
];

export const MANAGED_DEVICE_NOTE =
  "Researchers on university-managed devices may need to contact their university's IT department for permission to install the app.";

export const SUPPORT_EMAIL = "code@beckettfrey.com";

/**
 * The intuitiveness scale on the feedback form.
 *
 * Five points with only the ends named. Labelling every point invites the
 * reader to weigh wording ("is this 'rough' or 'awkward'?") rather than answer,
 * and the middle labels would have to be squeezed to fit on a phone anyway.
 */
export const FEEDBACK_SCALE = { min: 1, max: 5 };
export const FEEDBACK_SCALE_LOW_LABEL = "Confusing";
export const FEEDBACK_SCALE_HIGH_LABEL = "Effortless";

export const FEEDBACK_SUBJECT = "VoxKit install feedback";

/** Answer offered when no single step was the problem. */
export const FEEDBACK_NO_TROUBLE = "None of them";

/** Post-download steps for one platform, and the command they may involve. */
export type InstallGuide = {
  steps: string[];
  code?: { language: string; content: string };
};

export const INSTALL_GUIDES: Record<OperatingSystem, InstallGuide> = {
  macos: {
    steps: [
      "Open the downloaded .dmg and drag VoxKit into your Applications folder.",
      "Clear the quarantine flag macOS puts on apps downloaded from the internet. Setup will not complete without this.",
      "Launch VoxKit from Applications.",
    ],
    code: {
      language: "bash",
      content: "xattr -cr /Applications/VoxKit.app",
    },
  },
  windows: {
    steps: [
      "Double-click the downloaded executable and follow the prompts.",
      "If the installer will not run, try running it as administrator.",
    ],
  },
  linux: {
    steps: [
      "Linux builds are still being tested, so the steps below may change.",
      "Make the downloaded file executable, then run it.",
    ],
    code: {
      language: "bash",
      content: "chmod +x ./VoxKit*.AppImage\n./VoxKit*.AppImage",
    },
  },
};
