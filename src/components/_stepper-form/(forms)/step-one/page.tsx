import { FloatingDateController } from "@/components/custom/form.control/FloatingDateController";
import { FloatingInputController } from "@/components/custom/form.control/FloatingInputController";
import { FloatingSelectController } from "@/components/custom/form.control/FloatingSelectController";


const options = [
    { label: "Option A", value: "Option A" },
    { label: "Option B", value: "Option B" },
];

export default function StepOne() {


    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingInputController name="firstName" label={"First Name"} reset />
                <FloatingInputController name="middleName" label={"Middle Name"} reset />
                <FloatingInputController name="lastName" label={"Last Name"} reset />

                <FloatingDateController name="dob" label={"Date"} />

                <FloatingInputController name="email" label={"Email"} type="email" />

                <FloatingSelectController name="state" label={"State"} options={options} />
            </div>
        </div>
    );
}