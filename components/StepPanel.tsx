import type { ReactNode } from "react";
import { Check } from "lucide-react";
import type { InstallStep } from "../data/install-content";

/**
 * Where one step sits in the flow. The flow decides this centrally and hands it
 * down, so a panel never reasons about its own position.
 */
export type StepState = {
  /** Open and interactive: the one step the visitor is working through. */
  isActive: boolean;
  /** Already advanced past. Collapses to a checked row. */
  isComplete: boolean;
};

type StepPanelProps = StepState & {
  /** Anchor, heading, and supporting line. Named once in `INSTALL_STEPS`. */
  step: InstallStep;
  children: ReactNode;
};

/**
 * One step of the installation flow: card chrome, header, and the collapse
 * behaviour that makes the page a sequence rather than a wall.
 *
 * Owning the chrome in one place is the point. The steps are read in order, so
 * a padding or radius that drifts between them reads as an accident; panels
 * supply only their body and cannot restyle the frame.
 *
 * Three states, and the difference matters:
 *   active    open, full contrast, the thing to do now
 *   complete  collapsed to a checked row
 *   upcoming  collapsed, not yet reached
 *
 * Collapsed rows are inert. Navigation lives entirely on the connectors between
 * the cards -- the chevron below the open step goes forward, the one above it
 * goes back -- so a completed heading is a record of where you have been, not a
 * second way to move. Two competing navigation affordances on one page is how
 * a visitor loses track of which step they are actually on.
 *
 * Collapsed rows also stay legible rather than being greyed towards the
 * background. What separates them from the active step is expansion, heading
 * size, and the supporting line -- not dimness. A step you cannot read yet is
 * not a preview of where you are going, just a smudge.
 *
 * Collapsed bodies stay mounted behind the `hidden` attribute rather than being
 * unmounted. The release data is server-rendered specifically so crawlers and a
 * no-JS reader can see version numbers, and conditionally rendering the body
 * would throw that away the moment the flow gained a gate. `hidden` also keeps
 * collapsed content out of the accessibility tree.
 */
export default function StepPanel({
  step,
  isActive,
  isComplete,
  children,
}: StepPanelProps) {
  // Horizontal padding is identical in every state so the left edge of the
  // content never shifts as steps open and close; only vertical padding
  // tightens when a panel collapses.
  const frame = isActive
    ? "bg-slate-800/60 border-slate-500 shadow-xl shadow-black/20 py-6 sm:py-8"
    : "bg-slate-800/40 border-slate-600 py-5";

  const optionalChip = step.optional && (
    <span className="flex-shrink-0 rounded-full border border-slate-500 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
      Optional
    </span>
  );

  return (
    <section
      id={step.id}
      className={`scroll-mt-24 backdrop-blur-sm border rounded-2xl px-6 sm:px-8 transition-colors duration-300 ${frame}`}
    >
      {isActive ? (
        <header className="mb-6 pb-6 border-b border-slate-600">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold text-white">{step.title}</h2>
            {optionalChip}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {step.description}
          </p>
        </header>
      ) : (
        <h2 className="flex items-center gap-3 text-lg font-semibold">
          {isComplete ? (
            <Check
              className="w-5 h-5 text-cyan-400 flex-shrink-0"
              aria-hidden="true"
            />
          ) : (
            /* Placeholder keeps the title on the same left edge as the checked
               rows above it, so the column does not jog. */
            <span aria-hidden="true" className="w-5 flex-shrink-0" />
          )}
          <span className={isComplete ? "text-slate-200" : "text-slate-300"}>
            {step.title}
          </span>
          {optionalChip}
        </h2>
      )}

      <div id={`${step.id}-body`} hidden={!isActive}>
        {children}
      </div>
    </section>
  );
}
