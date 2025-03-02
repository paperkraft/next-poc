"use client";
import { useCallback, useEffect, useRef } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { MapPin, Phone, User } from "lucide-react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import StepperIndicator from "./StepperIndicator";
import { cn } from "@/lib/utils";
import StepOne from "./(forms)/step-one/page";
import StepTwo from "./(forms)/step-two/page";
import { toast } from "sonner";
import StepThree from "./(forms)/step-three/page";
import { useStepperStore } from "./useStepperStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils";

const stepComponents = [StepOne, StepTwo, StepThree];
const stepIcons = [<User />, <MapPin />, <Phone />];

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

const stepFields: Record<number, (keyof StepperFormValues)[]> = {
    1: ["firstName", "middleName", "lastName", "dob", "gender", "bloodGroup"],
    2: ["addressLine1", "addressLine2", "addressLine3", "country", "state", "city"],
    3: ["email", "mobile", "alternateMobile"],
};

export default function StepperForm() {
    const router = useRouter();
    const steps = Object.keys(stepFields).length;
    const { activeStep, setActiveStep, formData, updateFormData, resetForm } = useStepperStore();

    const form = useForm<StepperFormValues>({
        resolver: zodResolver(profileFormSchema),
        shouldUnregister: false,
        mode: 'onSubmit',
        defaultValues: {
            firstName: formData.firstName || "",
            middleName: formData.middleName || "",
            lastName: formData.lastName || "",
            dob: formData.dob || "",
            gender: formData.gender || "",
            bloodGroup: formData.bloodGroup || "",

            addressLine1: formData.addressLine1 || "",
            addressLine2: formData.addressLine2 || "",
            addressLine3: formData.addressLine3 || "",
            country: formData.country || "",
            state: formData.state || "",
            city: formData.city || "",

            email: formData.email || "",
            mobile: formData.mobile || "",
            alternateMobile: formData.alternateMobile || "",
        },
    });

    const prevValues = useRef<StepperFormValues | null>(null);

    const debouncedUpdateFormData = useCallback(
        debounce((data: StepperFormValues) => {
            if (JSON.stringify(prevValues.current) !== JSON.stringify(data)) {
                updateFormData(data);
                prevValues.current = data;
            }
        }, 500),
        [updateFormData]
    );

    useEffect(() => {
        if (Object.keys(formData).length) {
            const filteredData = Object.fromEntries(
                Object.entries(formData).filter(([key]) => Object.keys(profileFormSchema.shape).includes(key))
            );
            form.reset(filteredData);
        }
    }, [formData]);

    useEffect(() => {
        const subscription = form.watch((values) => {
            const filteredData = Object.fromEntries(
                Object.entries(values).filter(([key]) => Object.keys(profileFormSchema.shape).includes(key))
            );
            debouncedUpdateFormData(filteredData as StepperFormValues);
        });

        return () => subscription.unsubscribe();
    }, [debouncedUpdateFormData]);

    const handleNext = async () => {
        if (activeStep === steps) return;
        const currentStepFields = stepFields[activeStep] || [];
        const isStepValid = await form.trigger(currentStepFields, { shouldFocus: true });

        if (!isStepValid) {
            const firstErrorField = currentStepFields.find(field => form.formState.errors[field]);
            if (firstErrorField) {
                toast.error(form.formState.errors[firstErrorField]?.message || "Please fix the errors.");
            }
            return;
        }
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => setActiveStep(Math.max(activeStep - 1, 1));

    const handleError = (errors: FieldErrors<StepperFormValues>) => {
        const firstErrorField = Object.keys(errors)[0] as keyof StepperFormValues;
        if (firstErrorField) {
            toast.error(errors[firstErrorField]?.message || "Please fix the errors.");
        }
    }

    const onSubmit = async (formData: StepperFormValues) => {
        console.log("Form submitted:", formData);
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Form submitted successfully!' }), 2000));

        prevValues.current = null;
        resetForm();

        toast.promise(promise, {
            loading: 'Loading...',
            success: () => {
                router.refresh();
                setActiveStep(1);
                return `Form submitted successfully!`;
            },
            error: 'Error',
        });
    }

    const StepComponent = stepComponents[activeStep - 1];

    return (
        <>
            <StepperIndicator activeStep={activeStep} steps={steps} stepIcons={stepIcons} icons />
            <Form {...form}>
                <form noValidate className="space-y-4">
                    <motion.div
                        key={activeStep}
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -30, opacity: 0 }}
                    // transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {StepComponent && <StepComponent />}
                    </motion.div>
                    <div className="flex justify-between px-4">
                        <Button
                            type="button"
                            className={cn("w-[100px]", { 'invisible': activeStep === 1 })}
                            variant="secondary"
                            onClick={handleBack}
                            disabled={activeStep === 1}
                        >
                            Back
                        </Button>
                        {activeStep === steps
                            ? (<Button type="button" className="w-[100px]" onClick={form.handleSubmit(onSubmit, (errors) => handleError(errors))}>Submit</Button>)
                            : (<Button type="button" className="w-[100px]" onClick={handleNext}>Next</Button>)}
                    </div>
                </form>
            </Form>
        </>
    );
}