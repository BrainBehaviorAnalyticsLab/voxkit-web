import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * What this connector does, given where the visitor currently is:
 *   forward  it sits directly below the open step -- go on to the next one
 *   back     it sits directly above the open step -- return to the previous one
 *   none     it is nowhere near the open step -- decoration
 */
export type ConnectorRole = "forward" | "back" | "none";

type StepConnectorProps = {
  /** The visitor has already advanced past this link in the chain. */
  isComplete: boolean;
  role: ConnectorRole;
  /** Name of the step this control navigates to, for its accessible label. */
  targetTitle: string;
  onNavigate: () => void;
};

/**
 * The rail between two steps, and the controls that move you along it.
 *
 * This is what carries the ordering now that the panels have no number in the
 * corner: a track that fills cyan behind you and stays slate ahead of you, so
 * position in the sequence is legible from the connectors alone.
 *
 * It is also the only navigation on the page. The step headings are inert, so
 * exactly two connectors are ever live -- the one below the open panel and the
 * one above it -- and the visitor moves by walking the rail in one direction or
 * the other.
 *
 * Forward is deliberately the loudest thing on a quiet rail: a ringed, filled,
 * pulsing target with a word under it. A bare chevron on a line reads as
 * decoration, and this is the way onward, so it has to look pressable rather
 * than drawn. Back is a real control but a quieter one -- same shape, no fill,
 * no pulse -- because offering a retreat as insistently as the way forward
 * makes a sequence feel like a decision instead of a path.
 *
 * The dormant connectors are hidden from assistive tech: the step headings
 * already convey the order, and a row of identical inert chevrons in the tab
 * order would be noise. The live labels name their destination rather than
 * saying "continue", which is meaningless read out of context.
 */
export default function StepConnector({
  isComplete,
  role,
  targetTitle,
  onNavigate,
}: StepConnectorProps) {
  const rail = isComplete
    ? "bg-cyan-400/50"
    : role !== "none"
      ? "bg-cyan-400/25"
      : "bg-slate-600";

  const railSegment = (height: string) => (
    <span
      aria-hidden="true"
      className={`w-px ${height} transition-colors duration-300 ${rail}`}
    />
  );

  if (role === "none") {
    return (
      <div className="flex flex-col items-center" aria-hidden="true">
        {railSegment("h-5")}
        <span className="my-1 p-1.5">
          <ChevronDown
            className={`w-5 h-5 transition-colors duration-300 ${
              isComplete ? "text-cyan-400/60" : "text-slate-500"
            }`}
          />
        </span>
        {railSegment("h-5")}
      </div>
    );
  }

  const isForward = role === "forward";
  const Chevron = isForward ? ChevronDown : ChevronUp;

  return (
    <div className="flex flex-col items-center">
      {railSegment("h-4")}
      <button
        type="button"
        onClick={onNavigate}
        aria-label={
          isForward ? `Continue to ${targetTitle}` : `Back to ${targetTitle}`
        }
        className={
          isForward
            ? "step-advance-pulse my-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-cyan-400/70 bg-cyan-400/10 text-cyan-300 transition-all duration-200 hover:scale-110 hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            : "my-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-500 text-slate-400 transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:bg-white/5 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        }
      >
        <Chevron
          className={isForward ? "step-chevron-glide h-6 w-6" : "h-5 w-5"}
          strokeWidth={isForward ? 2.5 : 2}
        />
      </button>
      {/* The button's aria-label already names the destination, so this is
          duplicate wording for assistive tech and visual affordance only. */}
      <span
        aria-hidden="true"
        className={`mt-1 mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] ${
          isForward ? "text-cyan-400/90" : "text-slate-500"
        }`}
      >
        {isForward ? "Continue" : "Back"}
      </span>
      {railSegment("h-4")}
    </div>
  );
}
