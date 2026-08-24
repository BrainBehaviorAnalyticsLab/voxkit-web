"use client";
import { useState } from "react";
import { Check, Mail } from "lucide-react";
import StepPanel, { type StepState } from "./StepPanel";
import GridButton from "./GridButton";
import {
  FEEDBACK_SCALE,
  FEEDBACK_SCALE_HIGH_LABEL,
  FEEDBACK_SCALE_LOW_LABEL,
  FEEDBACK_SUBJECT,
  INSTALL_STEPS,
  SUPPORT_EMAIL,
} from "../data/install-content";
import { getOSDisplayName, type OS } from "../lib/os";

type FeedbackPanelProps = StepState & {
  /** OS the flow has been describing, reported alongside the answers. */
  os: OS;
  /** Version the visitor was offered, if the release lookup produced one. */
  version: string | null;
};

const RATINGS = Array.from(
  { length: FEEDBACK_SCALE.max - FEEDBACK_SCALE.min + 1 },
  (_, index) => FEEDBACK_SCALE.min + index,
);

/**
 * Optional last step: how the install actually felt.
 *
 * Submitting opens the visitor's mail client with the answers composed into a
 * message to support, rather than posting anywhere. This site has no backend to
 * receive form posts -- the only route is the revalidation cron -- and a form
 * that silently discarded what someone took the time to write would be worse
 * than no form. The button says "Open email draft" for the same reason: the
 * mail client appearing should be the expected outcome, not a surprise.
 *
 * Swapping this for a real endpoint is a change to `handleSubmit` alone; the
 * fields and their wording stay as they are.
 *
 * The platform and version are attached automatically. They are the first
 * things anyone reading the report would have to ask for, and the flow already
 * knows both.
 */
export default function FeedbackPanel({
  os,
  version,
  ...stepState
}: FeedbackPanelProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [issues, setIssues] = useState("");
  const [sent, setSent] = useState(false);

  // An empty report helps nobody, but either half on its own is worth having.
  const hasAnswer = rating !== null || issues.trim().length > 0;

  const draftUrl = () => {
    const body = [
      `How intuitive was the installation? ${
        rating === null
          ? "(not answered)"
          : `${rating} out of ${FEEDBACK_SCALE.max}`
      }`,
      "",
      "Issues encountered:",
      issues.trim() || "(none reported)",
      "",
      "---",
      `Platform: ${getOSDisplayName(os) || "unknown"}`,
      `Version offered: ${version ? `v${version}` : "unknown"}`,
    ].join("\n");

    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      FEEDBACK_SUBJECT,
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!hasAnswer) return;
    window.location.href = draftUrl();
    setSent(true);
  };

  if (sent) {
    return (
      <StepPanel {...stepState} step={INSTALL_STEPS.feedback}>
        <div className="flex items-start gap-3">
          <Check
            className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-sm text-slate-300 leading-relaxed">
            <p className="mb-2">
              Thank you — your email client should have opened with the feedback
              ready to send.
            </p>
            <p className="text-slate-400">
              If nothing opened, send it to{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-cyan-400 underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              instead, or{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-cyan-400 underline cursor-pointer"
              >
                go back to the form
              </button>
              .
            </p>
          </div>
        </div>
      </StepPanel>
    );
  }

  return (
    <StepPanel {...stepState} step={INSTALL_STEPS.feedback}>
      <form onSubmit={handleSubmit}>
        <fieldset className="mb-6">
          <legend className="text-sm font-semibold text-white mb-3">
            How intuitive was the installation?
          </legend>
          <div className="flex items-center gap-2">
            {RATINGS.map((value) => {
              const isPicked = rating === value;
              return (
                <label
                  key={value}
                  className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan-400 ${
                    isPicked
                      ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
                      : "border-slate-600 bg-slate-700/40 text-slate-300 hover:border-slate-400 hover:text-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="install-rating"
                    value={value}
                    checked={isPicked}
                    onChange={() => setRating(value)}
                    className="sr-only"
                  />
                  {value}
                </label>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500 max-w-[15.5rem]">
            <span>{FEEDBACK_SCALE_LOW_LABEL}</span>
            <span>{FEEDBACK_SCALE_HIGH_LABEL}</span>
          </div>
        </fieldset>

        <div className="mb-6">
          <label
            htmlFor="install-issues"
            className="block text-sm font-semibold text-white mb-3"
          >
            Did you run into any issues?
          </label>
          <textarea
            id="install-issues"
            value={issues}
            onChange={(event) => setIssues(event.target.value)}
            rows={5}
            placeholder="Anything that was unclear, broke, or took longer than it should have."
            className="w-full rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <GridButton
            type="submit"
            disabled={!hasAnswer}
            className={`text-small px-8 py-4 rounded-lg ${
              hasAnswer
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-white"
                : "bg-slate-700/40 text-slate-500 border-slate-600 cursor-not-allowed"
            }`}
            rippleColor="rgba(255, 255, 255, 0.5)"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Open email draft
          </GridButton>
          <p className="text-xs text-slate-500 leading-relaxed sm:text-right">
            Opens your email app with the answers filled in, addressed to{" "}
            {SUPPORT_EMAIL}. Nothing is sent until you send it.
          </p>
        </div>
      </form>
    </StepPanel>
  );
}
