import { Store, ShoppingCart, User, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import type { FC } from "react";

const CartEmptyStateHelper: FC = () => {
  const steps = [
    { icon: Store, label: "Select Store", description: "Choose a store location" },
    { icon: ShoppingCart, label: "Add to Cart", description: "Select items from menu" },
    { icon: User, label: "Select Customer", description: "Choose or create customer" },
    { icon: MapPin, label: "Add Address", description: "Select delivery address" },
    { icon: CheckCircle, label: "Checkout", description: "Complete the order" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pl-50/30 to-white dark:from-nd-900 dark:to-nd-950">
      <div className="flex max-w-4xl flex-col items-center gap-8 p-8 text-center">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-nl-800 dark:text-nd-100 text-3xl font-bold">
            Please Select a Store to Begin
          </h2>
          <p className="text-nl-500 dark:text-nd-400 text-lg">
            Follow these steps to create an order
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="flex w-full items-start justify-center gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.label} className="flex items-center gap-4">
                {/* Step Card */}
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-pl-100 dark:bg-nd-800 flex h-20 w-20 items-center justify-center rounded-2xl transition-all hover:scale-105">
                    <Icon
                      size={36}
                      className="text-pl-500 dark:text-pl-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-nl-800 dark:text-nd-100 text-sm font-semibold">
                      {step.label}
                    </div>
                    <div className="text-nl-500 dark:text-nd-400 text-xs">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Arrow between steps */}
                {!isLast && (
                  <ArrowRight
                    size={24}
                    className="text-nl-300 dark:text-nd-600 mb-8"
                    strokeWidth={2}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Text */}
        <div className="bg-pl-50 dark:bg-nd-800 text-nl-600 dark:text-nd-300 max-w-2xl rounded-lg border border-pl-200 dark:border-nd-700 p-4 text-sm">
          <strong>Tip:</strong> Use the store dropdown at the top to select a store
          and start creating orders.
        </div>
      </div>
    </div>
  );
};

export default CartEmptyStateHelper;
