import { Info } from "lucide-react";
import StepPanel, { type StepState } from "./StepPanel";
import {
  INSTALL_STEPS,
  MANAGED_DEVICE_NOTE,
  SYSTEM_REQUIREMENTS,
} from "../data/install-content";

/**
 * First step: whether this machine can run VoxKit at all.
 *
 * Deliberately ahead of the download. A researcher on a locked-down university
 * laptop should learn that before spending time on a download they cannot yet
 * use -- which is the whole reason the flow gates on it.
 *
 * Nothing here varies by operating system or by release, so the component is
 * pure markup; it renders inside the client flow only because the flow owns
 * which step is open.
 */
export default function RequirementsPanel(stepState: StepState) {
  return (
    <StepPanel {...stepState} step={INSTALL_STEPS.requirements}>
      <dl className="divide-y divide-slate-700">
        {SYSTEM_REQUIREMENTS.map((requirement) => (
          <div
            key={requirement.label}
            className="py-3 first:pt-0 last:pb-0 sm:flex sm:gap-6"
          >
            <dt className="text-sm font-semibold text-white sm:w-44 sm:flex-shrink-0">
              {requirement.label}
            </dt>
            <dd className="text-sm text-slate-300 leading-relaxed mt-1 sm:mt-0">
              {requirement.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 pt-6 border-t border-slate-600 flex items-start gap-3">
        <Info
          className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-slate-400 leading-relaxed">
          {MANAGED_DEVICE_NOTE}
        </p>
      </div>
    </StepPanel>
  );
}
