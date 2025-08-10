import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const steps = [
  { number: 1, label: "Registration" },
  { number: 2, label: "Voting" },
  { number: 3, label: "Confirmation" }
];

export default function ProgressIndicator({ currentStep, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("bg-white border-b", className)}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center space-x-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step.number <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  )}
                  data-testid={`step-${step.number}`}
                >
                  {step.number}
                </div>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    step.number <= currentStep
                      ? "font-medium text-primary"
                      : "text-gray-600"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-0.5 ml-8 transition-colors",
                    step.number < currentStep ? "bg-primary" : "bg-gray-300"
                  )}
                  data-testid={`connector-${step.number}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
