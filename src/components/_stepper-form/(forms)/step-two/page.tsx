import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";
import { FloatingSelectController } from "@/components/_form-controls/floating-label/select-controller";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "../../useFormHook";
import { PincodeEntry } from "@/app/api/location/route";

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

    const form = useFormContext();
    const [data, setData] = React.useState<PincodeEntry | null>(null);

    const searchPincode = useDebounce(async (val: string) => {
        if (val && val?.length === 6) {
            const response = await fetch(`/api/location?pincode=${val}`).then((res) => res.json());
            if (response.success) {
                setData(response.data);
                form.setValue("location.country", response.data.country, { shouldValidate: true });
                form.setValue("location.state", response.data.state, { shouldValidate: true });
                form.setValue("location.district", response.data.district, { shouldValidate: true, shouldDirty: true });
            } else {
                setData(null)
            }
        }
    }, 1000);

    const pincode = form.watch("location.pincode");

    React.useEffect(() => {
        searchPincode(pincode);
    }, [pincode])

    return (
        <div className="p-4 space-y-4">
            <p className="text-primary">Communication Information</p>
            <div className="grid md:grid-cols-3 gap-4">
                <FloatingInputController
                    name="location.pincode"
                    label={"Postal Code"}
                    type="number"
                    maxLength={6}
                />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <FloatingInputController
                    name="location.addressLine1"
                    label={"Address Line 1"}
                    type="text"
                />
                <FloatingInputController
                    name="location.addressLine2"
                    label={"Address Line 2"}
                    type="text"
                />

                {data ? (
                    <>
                        <FloatingSelectController
                            name="location.area"
                            label={"Area"}
                            options={data?.area?.flatMap((item) => {
                                return {
                                    label: item,
                                    value: item
                                }
                            })}
                        />
                        <FloatingInputController name="location.country" label={"Country"} type="text" readOnly />
                        <FloatingInputController name="location.state" label={"State"} type="text" readOnly />
                        <FloatingInputController name="location.district" label={"District"} type="text" readOnly />
                    </>
                ) : (
                    <>
                        <FloatingInputController name="location.area" label={"Area"} type="text" />
                        <FloatingSelectController name="location.country" label={"Country"} options={countryOptions} />
                        <FloatingSelectController name="location.state" label={"State"} options={stateOptions} />
                        <FloatingSelectController name="location.district" label={"City"} options={cityOptions} />
                    </>
                )}
            </div>
        </div>
    );
}