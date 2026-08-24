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
 * The open/close animation is a `grid-template-rows` transition between `0fr`
 * and `1fr`. That is the one way to ease to a content-determined height without
 * measuring it in JavaScript or inventing a max-height that content will one
 * day outgrow. The collapsed body therefore stays laid out rather than being
 * `display: none`, which also keeps the server-rendered version numbers in the
 * HTML for crawlers and no-JS readers; `inert` is what takes it out of the tab
 * order and the accessibility tree in its place.
 *
 * Nothing above a panel's own top edge is transitioned -- the header morphs and
 * the body eases, but both happen below it. The flow relies on that: it scrolls
 * to a step's top edge immediately, and a target that drifted for 300ms while
 * the animation settled would land in the wrong place.
 */
export default function StepPanel({
  step,
  isActive,
  isComplete,
  children,
}: StepPanelProps) {
  return (
    <section
      id={step.id}
      data-step-card
      className={`scroll-mt-24 backdrop-blur-sm border rounded-2xl px-6 sm:px-8 transition-[padding,background-color,border-color,box-shadow] duration-300 ease-out ${
        isActive
          ? "bg-slate-800/60 border-slate-500 shadow-xl shadow-black/20 py-6 sm:py-8"
          : "bg-slate-800/40 border-slate-600 py-5"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Always laid out, even before it is earned, so the title keeps the
            same left edge in every state and does not jog sideways when a step
            completes. */}
        <Check
          aria-hidden="true"
          className={`h-5 w-5 flex-shrink-0 text-cyan-400 transition-all duration-300 ease-out ${
            isComplete ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <h2
          className={`font-semibold transition-[font-size,line-height,color] duration-300 ease-out ${
            isActive
              ? "text-2xl text-white"
              : isComplete
                ? "text-lg text-slate-200"
                : "text-lg text-slate-300"
          }`}
        >
          {step.title}
        </h2>
        {step.optional && (
          <span className="flex-shrink-0 rounded-full border border-slate-500 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Optional
          </span>
        )}
      </div>

      <div
        data-step-body
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div
          className="overflow-hidden"
          aria-hidden={!isActive}
          inert={!isActive}
        >
          <p className="pt-2 pb-6 mb-6 border-b border-slate-600 text-sm text-slate-400 leading-relaxed">
            {step.description}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
