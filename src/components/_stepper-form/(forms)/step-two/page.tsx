import { FloatingDateController } from "@/components/custom/form.control/FloatingDateController";
import { FloatingInputController } from "@/components/custom/form.control/FloatingInputController";
import { FloatingSelectController } from "@/components/custom/form.control/FloatingSelectController";

const countryOptions = [
    { label: "India", value: "India" },
];
const stateOptions = [
    { label: "Maharashtra", value: "Maharashtra" },
];
const cityOptions = [
    { label: "Kolhapur", value: "Kolhapur" },
];

export default function StepTwo() {
    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Communication Information</p>
            <div className="grid md:grid-cols-3 gap-4">
                <FloatingInputController name="addressLine1" label={"Address Line 1"} reset type="text" />
                <FloatingInputController name="addressLine2" label={"Address Line 2"} reset type="text" />
                <FloatingInputController name="addressLine3" label={"Address Line 3"} reset type="text" />
                <FloatingSelectController name="country" label={"Country"} options={countryOptions} />
                <FloatingSelectController name="state" label={"State"} options={stateOptions} />
                <FloatingSelectController name="city" label={"City"} options={cityOptions} />
            </div>
        </div>
    );
}