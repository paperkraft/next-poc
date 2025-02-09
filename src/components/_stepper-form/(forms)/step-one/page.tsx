import { FloatingDateController } from "@/components/custom/form.control/FloatingDateController";
import { FloatingInputController } from "@/components/custom/form.control/FloatingInputController";
import { FloatingSelectController } from "@/components/custom/form.control/FloatingSelectController";

const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
];

const bloodGroupOptions = [
    { label: "A +ve", value: "A +ve" },
    { label: "A -ve", value: "A -ve" },
    { label: "B +ve", value: "B +ve" },
    { label: "B -ve", value: "B -ve" },
    { label: "AB +ve", value: "AB +ve" },
    { label: "AB -ve", value: "AB -ve" },
    { label: "O +ve", value: "O +ve" },
    { label: "O -ve", value: "O -ve" },
];

export default function StepOne() {
    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingInputController name="firstName" label={"First Name"} reset />
                <FloatingInputController name="middleName" label={"Middle Name"} reset />
                <FloatingInputController name="lastName" label={"Last Name"} reset />

                <FloatingDateController name="dob" label={"Date of Birth"} />
                <FloatingSelectController name="gender" label={"Gender"} options={genderOptions} />
                <FloatingSelectController name="bloodGroup" label={"Blood Group"} options={bloodGroupOptions} />
            </div>
        </div>
    );
}