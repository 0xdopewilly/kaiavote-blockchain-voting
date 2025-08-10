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
    <div className={cn("glass-morph border-2 border-primary/20 mx-6 my-4 rounded-2xl", className)}>
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-center space-x-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300",
                      step.number <= currentStep
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                        : "bg-muted/20 text-muted-foreground border border-muted/30"
                    )}
                    data-testid={`step-${step.number}`}
                  >
                    {step.number}
                  </div>
                  {step.number <= currentStep && (
                    <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-lg font-medium transition-all duration-300",
                    step.number <= currentStep
                      ? "text-white font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-20 h-1 ml-12 rounded-full transition-all duration-300",
                    step.number < currentStep 
                      ? "bg-gradient-to-r from-primary to-accent shadow-lg" 
                      : "bg-muted/20"
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
