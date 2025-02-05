import { FloatingInputController } from "@/components/custom/form.control/FloatingInputController";

export default function StepOne() {
    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingInputController name="firstName" label={"First Name"} reset />
                <FloatingInputController name="lastName" label={"Last Name"} reset/>
                <FloatingInputController name="email" label={"Email"} type="email" />
            </div>
        </div>
    );
}