import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Check, Dot } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StepperIndicatorProps {
  steps: number;
  activeStep: number;
  icons?: boolean;
  stepIcons?: React.ReactNode[];
}

const StepperIndicator = ({ steps, activeStep, icons = false, stepIcons = [] }: StepperIndicatorProps) => {
  const stepArray = Array.from({ length: steps }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center">
      {stepArray.map((step) => (
        <Fragment key={step}>
          <div
            className={cn("size-10 flex justify-center items-center m-[5px] border-[2px] rounded-full", {
              "bg-primary text-primary-foreground": step < activeStep,
              "border-primary text-primary": step === activeStep
            })}
          >
            {icons && stepIcons[step - 1]
              ? stepIcons[step - 1]
              : step < activeStep
                ? <Check className="size-5" />
                : step}
          </div>

          {step !== steps && (
            <Separator orientation="horizontal" className={cn("w-[100px] h-[2px]", step <= activeStep - 1 && "bg-primary")} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default StepperIndicator;
