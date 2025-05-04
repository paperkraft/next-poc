import { FloatingDateController } from "@/components/_form-controls/floating-label/date-controller";
import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";
import { FloatingSelectController } from "@/components/_form-controls/floating-label/select-controller";

const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
];

const bloodGroupOptions = [
    { label: "A +", value: "A+" },
    { label: "A -", value: "A-" },
    { label: "B +", value: "B+" },
    { label: "B -", value: "B-" },
    { label: "AB +", value: "AB+" },
    { label: "AB -", value: "AB-" },
    { label: "O +", value: "O+" },
    { label: "O -", value: "O-" },
];

export default function StepOne() {
    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingInputController name="firstName" label={"First Name"} reset />
                <FloatingInputController name="middleName" label={"Middle Name"} reset />
                <FloatingInputController name="lastName" label={"Last Name"} reset />

                <FloatingDateController name="dob" label={"Date of Birth"} disableFuture/>
                <FloatingSelectController name="gender" label={"Gender"} options={genderOptions} />
                <FloatingSelectController name="bloodGroup" label={"Blood Group"} options={bloodGroupOptions} />
            </div>
        </div>
    );
}