"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { LucideBuilding2, MapPin, Phone, User } from "lucide-react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import StepperIndicator from "./StepperIndicator";
import { cn } from "@/lib/utils";
import StepOne from "./(forms)/step-one/page";
import StepTwo from "./(forms)/step-two/page";
import { toast } from "sonner";
import StepThree from "./(forms)/step-three/page";

function getStepContent(step: number) {
    switch (step) {
        case 1:
            return <StepOne />;
        case 2:
            return <StepTwo />;
        case 3:
            return <StepThree />;
        default:
            return null;
    }
}

// const stepsComponents = [StepOne, StepTwo, null, null];
// function getStepContent(step: number) {
//     const StepComponent = stepsComponents[step - 1];
//     return StepComponent ? <StepComponent /> : "Unknown step";
// }

const stepIcons = [<User />, <MapPin />, <Phone />, <LucideBuilding2 />];

const profileFormSchema = z.object({
    firstName: z.string({ required_error: "First Name is required" })
        .min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string({ required_error: "Last Name is required" })
        .min(1, "Last Name is required"),
    dob: z.coerce.date({ errorMap: () => ({ message: "Date is required.", }) }),
    gender: z.string({ required_error: "Please select a gender." })
        .min(1, "Please select a gender."),
    bloodGroup: z.string({ required_error: "Please select a blood group." })
        .min(1, "Please select a blood group."),
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required").email(),
    mobile: z.string().min(1, "Mobile No. is required"),
    alternateMobile: z.string(),

    addressLine1: z.string(),
    addressLine2: z.string(),
    addressLine3: z.string(),

    country: z.string().min(1, "Please select a country."),
    state: z.string().min(1, "Please select a state."),
    city: z.string().min(1, "Please select a city."),
});

type StepperFormValues = z.infer<typeof profileFormSchema>

export default function StepperForm() {

    const steps = 3;
    const [activeStep, setActiveStep] = useState(1);

    const form = useForm<StepperFormValues>({
        resolver: zodResolver(profileFormSchema),
        shouldUnregister: false,
        mode: 'onChange',
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            dob: undefined,
            gender: "",
            bloodGroup: "",

            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
            country: "",
            state: "",
            city: "",

            email: "",
            mobile: "",
            alternateMobile: "",
        },
    });

    const stepFields: Record<number, (keyof StepperFormValues)[]> = {
        1: ["firstName", "middleName", "lastName", "dob", "gender", "bloodGroup"],
        2: ["addressLine1", "addressLine2", "addressLine3", "country", "state", "city"],
        3: ["email", "mobile", "alternateMobile"],
    };

    const handleNext = async () => {
        
        const currentStepFields = stepFields[activeStep] || [];
        const isStepValid = await form.trigger(currentStepFields, { shouldFocus: true });
        console.log('activeStep', activeStep);
        console.log('currentStepFields', currentStepFields);
        
        if (!isStepValid) {
            const firstErrorField = currentStepFields.find(field => form.formState.errors[field]);
            if (firstErrorField) {
                toast.error(form.formState.errors[firstErrorField]?.message || "Please fix the errors.");
            }
            return;
        }

        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 1)); 
    };

    const onSubmit = async (formData: StepperFormValues) => {
        console.log("Current activeStep:", activeStep, "Total steps:", steps);
        if (activeStep === steps) {
            console.log('Submitting last step...');
            const isLastStepValid = await form.trigger(undefined, { shouldFocus: true });
            if (!isLastStepValid) {
                const firstErrorField = Object.keys(form.formState.errors)[0] as keyof StepperFormValues;
                if (firstErrorField) {
                    toast.error(form.formState.errors[firstErrorField]?.message || "Please fix the errors.");
                }
                return;
            }
        }

        console.log("formData", formData);
    }

    return (
        <>
            <StepperIndicator activeStep={activeStep} steps={steps} stepIcons={stepIcons} icons />
            <Form {...form}>
                <form noValidate className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    {getStepContent(activeStep)}
                    <div className="flex justify-between px-4">
                        <Button type="button" className={cn("w-[100px]", { 'invisible': activeStep === 1 })} variant="secondary" onClick={handleBack} disabled={activeStep === 1}>Back</Button>
                        {activeStep === steps
                            ? (<Button className="w-[100px]" type="submit">Submit</Button>)
                            : (<Button type="button" className="w-[100px]" onClick={handleNext}>Next</Button>)}
                    </div>
                </form>
            </Form>
        </>
    );
}