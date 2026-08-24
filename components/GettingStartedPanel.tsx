"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import StepPanel, { type StepState } from "./StepPanel";
import {
  INSTALL_GUIDES,
  INSTALL_STEPS,
  SUPPORT_EMAIL,
} from "../data/install-content";
import { getOSDisplayName, type OS } from "../lib/os";

type GettingStartedPanelProps = StepState & {
  /** OS the download panel is showing; null when no build applies to it. */
  os: OS;
};

/**
 * Last step: what to do once the download finishes.
 *
 * Follows the OS selected in the step above rather than listing all three
 * platforms. The visitor has just chosen a build, and macOS quarantine
 * instructions are noise to someone who took the Windows installer.
 */
export default function GettingStartedPanel({
  os,
  ...stepState
}: GettingStartedPanelProps) {
  const [copied, setCopied] = useState(false);
  const guide = os ? INSTALL_GUIDES[os] : null;
  const osName = getOSDisplayName(os);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <StepPanel {...stepState} step={INSTALL_STEPS.gettingStarted}>
      {guide ? (
        <>
          <h3 className="text-lg font-semibold text-white mb-4">
            Installing on {osName}
          </h3>
          <ol className="space-y-3 mb-6">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700/60 text-slate-300 text-xs font-semibold flex items-center justify-center mt-0.5"
                >
                  {index + 1}
                </span>
                <span className="text-sm text-slate-300 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          {guide.code && (
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <span className="text-sm text-slate-400 font-mono">
                  {guide.code.language}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(guide.code?.content ?? "")}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="bg-slate-900 p-4 overflow-x-auto">
                <code className="text-sm text-slate-300 font-mono leading-relaxed">
                  {guide.code.content}
                </code>
              </pre>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-300">
          Select your operating system in the download step to see its install
          steps.
        </p>
      )}

      <div className="mt-6 pt-6 border-t border-slate-600 text-sm text-slate-400 leading-relaxed">
        Having issues? See the{" "}
        <Link href="/help/troubleshooting" className="text-cyan-400 underline">
          troubleshooting guide
        </Link>{" "}
        or email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-cyan-400 underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </div>
    </StepPanel>
  );
}
