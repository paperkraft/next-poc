import { InputController } from "@/components/custom/form.control/InputController";
import { FloatingLabelInput } from "@/components/ui/floating-input";
import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../types/stepperTypes";

export default function StepOne() {
    const form = useFormContext<StepperFormValues>()
    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputController name="firstName" label={"First Name"} required reset />
                <InputController name="lastName" label={"Last Name"} reset />

                <FloatingLabelInput label="Address" {...form.register("address", { required: "Required" })}
                />
            </div>
        </div>
    );
}