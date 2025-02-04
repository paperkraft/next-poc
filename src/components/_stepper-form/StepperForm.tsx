"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { StepperFormValues } from "./types/stepperTypes";
import StepperIndicator from "./components/stepper-indicator/page";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import StepOne from "./(forms)/step-one/page";
import { LucideBuilding2, MapPin, Phone, User } from "lucide-react";

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

const stepIcons = [<User />, <MapPin />, <Phone />, <LucideBuilding2 />]

export default function StepperForm() {

    const steps = 4;
    const [activeStep, setActiveStep] = useState(1);

    const form = useForm<StepperFormValues>({
        // mode: "onTouched",
        defaultValues: {
            firstName: "",
            lastName: "",
        }
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
                <form noValidate>

                    {getStepContent(activeStep)}

                    <div className="flex justify-evenly">
                        <Button type="button" className="w-[100px]" variant="secondary" onClick={handleBack} disabled={activeStep === 1}>
                            Back
                        </Button>
                        {activeStep === steps ? (
                            <Button className="w-[100px]" type="button" onClick={form.handleSubmit(onSubmit)}>
                                Submit
                            </Button>
                        ) : (
                            <Button type="button" className="w-[100px]" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </>
    );
}