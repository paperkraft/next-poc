import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Check, Dot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface StepperIndicatorProps {
  steps: number;
  activeStep: number;
  icons?: boolean;
  stepIcons?: React.ReactNode[];
}

const StepperIndicator = ({ steps, activeStep, icons = false, stepIcons = [] }: StepperIndicatorProps) => {
  const stepArray = Array.from({ length: steps }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center p-4">
      {stepArray.map((step, index) => (
        <Fragment key={step}>
          <div
            className={cn("size-10 flex justify-center items-center border-2 rounded-full",
              step < activeStep
                ? "bg-primary text-primary-foreground border-primary"
                : step === activeStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-muted text-muted-foreground"
            )}
          >
            {icons && stepIcons[step - 1]
              ? stepIcons[step - 1]
              : step < activeStep
                ? <Check className="size-5" />
                : step}
          </div>

          {index < steps - 1 && (
            <div className="relative flex-grow h-0.5 bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step < activeStep ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute left-0 top-0 h-full bg-primary"
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default StepperIndicator;
