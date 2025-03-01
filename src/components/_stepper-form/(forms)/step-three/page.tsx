import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";

export default function StepThree() {
    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Communication Information</p>
            <div className="grid md:grid-cols-3 gap-4">
                <FloatingInputController name="email" label={"Email"} reset type="text" />
                <FloatingInputController name="mobile" label={"Mobile No."} reset type="number" maxLength={10} />
                <FloatingInputController name="alternateMobile" label={"Alternate Mobile No."} reset type="number" maxLength={10} />
            </div>
        </div>
    );
}