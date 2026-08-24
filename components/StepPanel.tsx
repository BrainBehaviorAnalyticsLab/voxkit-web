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
  /** Zero-based position in the flow, which the marker renders as a letter. */
  index: number;
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
 * The mark at the left of the heading carries both. Before a step is finished
 * it is that step's letter, and finishing it turns the letter into a check --
 * so the slot always says something, and a row's position in the flow is
 * legible from the row itself rather than only from the rail beside it. Letters
 * rather than numbers because the rail is the thing that counts progress; a
 * number in the heading invites reading it as "3 of 4" and disagreeing with
 * however far the rail says you have got.
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
 * Every state therefore sits on the same card surface the rest of the site
 * uses -- `.tile` over `bg-slate-800/50`, matching the panels on the features
 * page -- so a collapsed step still reads as a solid object rather than a line
 * ruled on the page background. The active step is the same surface turned up
 * (`/75`, a lighter border, a shadow), which keeps the difference between the
 * states a matter of emphasis instead of presence. Both are solid colours on
 * purpose: `background-color` is what the card transitions, and a gradient on
 * one side of that transition would pop rather than ease.
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
  index,
  children,
}: StepPanelProps) {
  const letter = String.fromCharCode(65 + index);

  return (
    <section
      id={step.id}
      data-step-card
      className={`tile scroll-mt-24 backdrop-blur-sm border rounded-2xl px-6 sm:px-8 transition-[padding,background-color,border-color,box-shadow] duration-300 ease-out ${
        isActive
          ? "bg-slate-800/75 border-slate-500 shadow-xl shadow-black/20 py-6 sm:py-8"
          : "bg-slate-800/50 border-slate-600 py-5"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* One fixed slot holding both marks, stacked in a single grid cell so
            they cross-fade in place. A slot that changed size between the
            letter and the check would jog the title sideways as a step
            completes, and the letter would have nothing to turn into. */}
        <span
          aria-hidden="true"
          data-step-mark
          className="grid h-5 w-5 flex-shrink-0 place-items-center"
        >
          <Check
            className={`col-start-1 row-start-1 h-5 w-5 text-cyan-400 transition-all duration-300 ease-out ${
              isComplete ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />
          <span
            className={`col-start-1 row-start-1 text-sm font-bold leading-none transition-all duration-300 ease-out ${
              isComplete
                ? "scale-50 opacity-0"
                : `scale-100 opacity-100 ${
                    isActive ? "text-cyan-400" : "text-slate-400"
                  }`
            }`}
          >
            {letter}
          </span>
        </span>
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
