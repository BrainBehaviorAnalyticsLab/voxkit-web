"use client";
import { useState } from "react";
import { Check, Mail } from "lucide-react";
import StepPanel, { type StepState } from "./StepPanel";
import GridButton from "./GridButton";
import {
  FEEDBACK_NO_TROUBLE,
  FEEDBACK_SCALE,
  FEEDBACK_SCALE_HIGH_LABEL,
  FEEDBACK_SCALE_LOW_LABEL,
  FEEDBACK_SUBJECT,
  INSTALL_STEPS,
  INSTALL_STEP_ORDER,
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
 * The steps a visitor could have struggled with, taken from the flow itself so
 * renaming a step relabels the question too. The optional step is filtered out:
 * this form is the optional step, and offering it as an answer about where the
 * install went wrong is a question about itself.
 */
const TROUBLE_OPTIONS = [
  ...INSTALL_STEP_ORDER.filter((step) => !step.optional).map(
    (step) => step.title,
  ),
  FEEDBACK_NO_TROUBLE,
];

const NOT_ANSWERED = "(not answered)";

const FIELD_LABEL = "text-sm font-semibold text-white mb-3";

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-slate-600 bg-slate-900/60 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none";

const optionClass = (isPicked: boolean) =>
  `cursor-pointer border text-sm transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan-400 ${
    isPicked
      ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
      : "border-slate-600 bg-slate-700/40 text-slate-300 hover:border-slate-400 hover:text-white"
  }`;

/**
 * A question answered by picking one of several words.
 *
 * Declared at module scope rather than inside the panel. A component defined in
 * a render body is a new type on every render, so React would unmount and
 * remount the whole subtree on each keystroke elsewhere in the form -- which
 * for the text questions below means losing focus mid-word.
 */
function ChoiceQuestion({
  label,
  name,
  options,
  value,
  onPick,
}: {
  label: string;
  name: string;
  options: string[];
  value: string | null;
  onPick: (option: string) => void;
}) {
  return (
    <fieldset className="mb-6">
      <legend className={FIELD_LABEL}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`rounded-lg px-3 py-2 ${optionClass(value === option)}`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onPick(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A question answered in free text. */
function TextQuestion({
  id,
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder: string;
}) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className={`block ${FIELD_LABEL}`}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={TEXTAREA_CLASS}
      />
    </div>
  );
}

/**
 * Optional last step: how the install actually felt.
 *
 * Every question is skippable and the form submits with any one of them
 * answered. It is the last thing between a researcher and the work they
 * actually came to do, so requiring a complete response would mostly buy
 * abandoned forms rather than better data.
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
  const [troubleStep, setTroubleStep] = useState<string | null>(null);
  const [issues, setIssues] = useState("");
  const [sent, setSent] = useState(false);

  // An empty report helps nobody, but any single answer is worth having.
  const hasAnswer =
    rating !== null || troubleStep !== null || issues.trim().length > 0;

  const draftUrl = () => {
    const body = [
      `How intuitive was the installation? ${
        rating === null
          ? NOT_ANSWERED
          : `${rating} out of ${FEEDBACK_SCALE.max}`
      }`,
      `Hardest step: ${troubleStep ?? NOT_ANSWERED}`,
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
          <legend className={FIELD_LABEL}>
            How intuitive was the installation?
          </legend>
          <div className="flex items-center gap-2">
            {RATINGS.map((value) => (
              <label
                key={value}
                className={`flex h-11 w-11 items-center justify-center rounded-lg font-semibold ${optionClass(
                  rating === value,
                )}`}
              >
                <input
                  type="radio"
                  name="install-rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  className="sr-only"
                />
                {value}
              </label>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500 max-w-[15.5rem]">
            <span>{FEEDBACK_SCALE_LOW_LABEL}</span>
            <span>{FEEDBACK_SCALE_HIGH_LABEL}</span>
          </div>
        </fieldset>

        <ChoiceQuestion
          label="Which step gave you the most trouble?"
          name="install-trouble"
          options={TROUBLE_OPTIONS}
          value={troubleStep}
          onPick={setTroubleStep}
        />

        <TextQuestion
          id="install-issues"
          label="Did you run into any issues?"
          value={issues}
          onChange={setIssues}
          rows={4}
          placeholder="Anything that was unclear, broke, or took longer than it should have."
        />

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
            Draft
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
