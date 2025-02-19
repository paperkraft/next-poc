"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { LucideBuilding2, MapPin, Phone, User } from "lucide-react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import StepperIndicator from "./StepperIndicator";
import StepOne from "./(forms)/step-one/page";
import { cn } from "@/lib/utils";

function getStepContent(step: number) {
    switch (step) {
        case 1:
            return <StepOne />;
        case 2:
            return <>2</>;
        case 3:
            return <>3</>;
        case 4:
            return <>4</>;
        case 5:
            return <>5</>;
        default:
            return "Unknown step";
    }
}

const stepIcons = [<User />, <MapPin />, <Phone />, <LucideBuilding2 />];

const profileFormSchema = z.object({
    firstName: z.string({ required_error: "First Name is required" })
        .min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string({ required_error: "Last Name is required" })
        .min(1, "Last Name is required"),
    dob: z.coerce.date({ errorMap: () => ({ message: "Date is required.", }) }),
    gender: z.string({ required_error: "Please select a state." })
        .min(1, "Please select a state."),
    bloodGroup: z.string({ required_error: "Please select a blood group." })
        .min(1, "Please select a blood group."),
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required").email(),
});

type StepperFormValues = z.infer<typeof profileFormSchema>

export default function StepperForm() {

    const steps = 4;
    const [activeStep, setActiveStep] = useState(1);

    const form = useForm<StepperFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            dob: undefined,
            gender: "",
            bloodGroup: "",
            email: "",
        },
        mode: "all"
    });

    const handleNext = async () => {
        const isStepValid = await form.trigger(undefined, { shouldFocus: true });
        if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const onSubmit = async (formData: StepperFormValues) => {
        console.log("formData", formData);
    }

    return (
        <>
            <StepperIndicator activeStep={activeStep} steps={steps} stepIcons={stepIcons} icons />
            <Form {...form}>
                <form noValidate className="space-y-4">
                    {getStepContent(activeStep)}
                    <div className="flex justify-between">
                        <Button type="button" className={cn("w-[100px]", { 'invisible': activeStep === 1 })} variant="secondary" onClick={handleBack} disabled={activeStep === 1}>Back</Button>
                        {activeStep === steps
                            ? (<Button className="w-[100px]" type="button" onClick={form.handleSubmit(onSubmit)}>Submit</Button>)
                            : (<Button type="button" className="w-[100px]" onClick={handleNext}>Next</Button>)}
                    </div>
                </form>
            </Form>
        </>
    );
}