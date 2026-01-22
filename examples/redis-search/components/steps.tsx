import { Step } from "./step";
import { StepConfig } from "@/types/step";

interface StepsProps {
  steps: StepConfig[];
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <Step key={index} config={step} index={index + 1} />
      ))}
    </div>
  );
}
