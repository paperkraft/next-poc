'use client';
import { FloatingInputController } from "@/components/_form-controls/floating-label/input-controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function StepFour() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({ control, name: "emergencyContacts" });
    const maxContacts = 3;

    const addContact = () => {
        if (fields.length >= maxContacts) {
            return;
        }
        append({  name: "", phone: "" });
    }

    return (
        <>
            <div className="p-4 space-y-4">
            <p className="text-primary">Emergency Contacts <span className="text-muted-foreground text-xs">(up to 3)</span></p>
                
                <Button onClick={addContact} type="button" className={cn(fields.length == maxContacts && "hidden")}>Add Contact</Button>
                
                {fields.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-baseline">
                        <span>{`${index + 1}.`}</span>
                        <FloatingInputController name={`emergencyContacts.${index}.name`} label={`Name`}/>
                        <FloatingInputController name={`emergencyContacts.${index}.phone`} label={`Contact`} type="number" maxLength={10}/>
                        <Button variant='ghost' onClick={() => remove(index)} type="button" className="size-8 hover:text-red-600">
                            <X size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
}