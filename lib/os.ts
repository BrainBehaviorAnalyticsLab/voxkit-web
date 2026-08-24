import type { OperatingSystem } from "../types/releases";

/** An operating system, or none: detection can fail and no OS is preselected. */
export type OS = OperatingSystem | null;

const OS_DISPLAY_NAMES: Record<OperatingSystem, string> = {
  macos: "macOS",
  windows: "Windows",
  linux: "Linux",
};

/**
 * Single source for how an OS is spelled on the page, so the download panel and
 * the install steps below it never disagree about the build being described.
 */
export const getOSDisplayName = (os: OS): string =>
  os ? OS_DISPLAY_NAMES[os] : "";

export const detectOS = (): OS => {
  if (typeof window === "undefined") return null;
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  return null;
};

// There is no user agent to sniff during SSR, so detection is modeled as an
// external store: React renders `null` on the server and again while hydrating,
// then re-renders with the real value. The user agent never changes
// mid-session, so there is nothing to subscribe to.
export const subscribeToOS = () => () => {};
export const getServerOS = (): OS => null;
