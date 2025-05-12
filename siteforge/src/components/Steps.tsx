import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

const [steps] = [];

interface StepsProps {
  className?: string;
}

export const Steps = ({ className = "" }: StepsProps) => {

  //const [steps] = useState<Step[]>([]);
  return (
    <div className={`bg-editor-background p-4 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Progress</h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center space-x-3 p-2 rounded ${
              step.status === "current" ? "bg-white/5" : ""
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === "complete" ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : step.status === "current" ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/20" />
              )}
            </div>
            <span
              className={
                step.status === "upcoming" ? "text-white/50" : "text-white"
              }
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};