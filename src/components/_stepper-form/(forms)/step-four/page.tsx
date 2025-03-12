'use client';
import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function StepFour() {
    const { control } = useFormContext();
    const { fields, append } = useFieldArray({ control, name: "emergencyContacts" });


    const addContact = () => {
        append({ contact: "" });
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <p className="text-primary">Emergency Contacts</p>
                
                <Button onClick={addContact} type="button">Add Contact</Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fields.map((item, index) => (
                        <FloatingInputController name={`emergencyContacts.${index}.contact`} label={`Contact - ${index + 1}`} key={item.id}/>
                    ))}
                </div>
            </div>
        </>
    );
}