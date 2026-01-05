import { Check } from "lucide-react";
import type { FC } from "react";
import {
  useProductWizard,
  type ProductWizardStep,
} from "./ProductWizardContext";

const ProductWizardStepper: FC = () => {
  const { currentStep, setCurrentStep, getStepConfig } = useProductWizard();
  const steps = getStepConfig();

  const handleStepClick = (step: ProductWizardStep) => {
    setCurrentStep(step);
  };

  // Determine if a step is completed (visited and has data)
  // For now, we consider steps before current as "completed"
  const isStepCompleted = (stepNumber: ProductWizardStep) => {
    return stepNumber < currentStep;
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Steps */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-1">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = isStepCompleted(step.number);

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => handleStepClick(step.number)}
                className={`flex items-start gap-3 rounded-lg p-3 text-left transition-all ${
                  isActive
                    ? "bg-pl-50 dark:bg-pd-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {/* Step indicator */}
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-pl-500 text-white"
                      : isCompleted
                        ? "bg-pl-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step content */}
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-pl-700 dark:text-pl-300"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`text-xs ${
                      isActive
                        ? "text-pl-600 dark:text-pl-400"
                        : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductWizardStepper;
