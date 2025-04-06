"use client";
import { useCallback, useEffect, useRef } from "react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { BriefcaseMedical, MapPin, Phone, User } from "lucide-react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import StepperIndicator from "./StepperIndicator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createStore } from "./useStepperStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils";
import dynamic from "next/dynamic";

const StepOne = dynamic(() => import("./(forms)/step-one/page"), { loading: () => <p>Loading...</p> });
const StepTwo = dynamic(() => import("./(forms)/step-two/page"), { loading: () => <p>Loading...</p> });
const StepThree = dynamic(() => import("./(forms)/step-three/page"), { loading: () => <p>Loading...</p> });
const StepFour = dynamic(() => import("./(forms)/step-four/page"), { loading: () => <p>Loading...</p> });

const stepComponents = [StepOne, StepTwo, StepThree, StepFour];
const stepIcons = [<User />, <MapPin />, <Phone />, <BriefcaseMedical />];

const profileFormSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last Name is required"),
    dob: z.coerce.date().refine((date) => !!date, { message: "Date is required." }),
    gender: z.string().min(1, "Please select a gender."),
    bloodGroup: z.string().min(1, "Please select a blood group."),
    email: z.string().email("Please enter a valid email address."),
    mobile: z.string().min(1, "Mobile No. is required"),
    alternateMobile: z.string().optional(),

    location: z.object({
        addressLine1: z.string().min(1, "Address Line 1 is required"),
        addressLine2: z.string().optional(),
        addressLine3: z.string().optional(),
        country: z.string().min(1, "Please select a country."),
        state: z.string().min(1, "Please select a state."),
        city: z.string().min(1, "Please select a city."),
    }),

    emergencyContacts: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
    })).optional(),
});

type StepperFormValues = z.infer<typeof profileFormSchema>;

const stepFields: Record<number, (keyof StepperFormValues | `location.${keyof StepperFormValues["location"]}`)[]> = {
    1: ["firstName", "middleName", "lastName", "dob", "gender", "bloodGroup"],
    2: [
        "location.addressLine1",
        "location.addressLine2",
        "location.addressLine3",
        "location.country",
        "location.state",
        "location.city"
    ],
    3: ["email", "mobile", "alternateMobile"],
    4: ["emergencyContacts"],
};

const steps = Object.keys(stepFields).length;
const stepperStore = createStore("profile-form");

export default function StepperForm() {
    const router = useRouter();
    const { activeStep, setActiveStep, formData, updateFormData, resetForm } = stepperStore();

    const form = useForm<StepperFormValues>({
        resolver: zodResolver(profileFormSchema),
        shouldUnregister: false,
        mode: 'onChange',
        defaultValues: {
            firstName: formData.firstName || "",
            middleName: formData.middleName || "",
            lastName: formData.lastName || "",
            dob: formData.dob || "",
            gender: formData.gender || "",
            bloodGroup: formData.bloodGroup || "",

            location: {
                addressLine1: formData.location?.addressLine1 || "",
                addressLine2: formData.location?.addressLine2 || "",
                addressLine3: formData.location?.addressLine3 || "",
                country: formData.location?.country || "",
                state: formData.location?.state || "",
                city: formData.location?.city || "",
            },

            email: formData.email || "",
            mobile: formData.mobile || "",
            alternateMobile: formData.alternateMobile || "",

            emergencyContacts: formData.emergencyContacts || [{ name: "", phone: "" }],
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
        const subscription = form.watch((values) => {
            const filteredData = {
                ...values,
                location: JSON.parse(JSON.stringify(values.location)),
                emergencyContacts: JSON.parse(JSON.stringify(values.emergencyContacts)),
            };
            debouncedUpdateFormData(filteredData as StepperFormValues);
        });

        return () => subscription.unsubscribe();
    }, [debouncedUpdateFormData, form]);

    const handleNext = async () => {
        if (activeStep === steps) return;

        const currentStepFields = stepFields[activeStep] || [];
        const isStepValid = await form.trigger(currentStepFields, { shouldFocus: true });

        if (!isStepValid) {
            handleError(form, form.formState.errors, activeStep);
            return;
        }

        setActiveStep(activeStep + 1);
    };

    const handleBack = () => setActiveStep(Math.max(activeStep - 1, 1));

    const onSubmit = async (formData: StepperFormValues) => {
        console.log("Form submitted:", formData);
        prevValues.current = null;
        resetForm();
        form.reset();

        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Form submitted successfully!' }), 2000));

        toast.promise(promise, {
            loading: 'Loading...',
            success: () => {
                setActiveStep(1);
                router.refresh();
                stepperStore.persist.clearStorage();
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
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                            ? (<Button type="button" className="w-[100px]" onClick={form.handleSubmit(onSubmit, (errors) => handleError(form, errors, activeStep))}>Submit</Button>)
                            : (<Button type="button" className="w-[100px]" onClick={handleNext}>Next</Button>)}
                    </div>
                </form>
            </Form>
        </>
    );
}

interface NestedErrors {
    [key: string]: any
}

const getNestedError = (errors: NestedErrors, fieldPath: string): { message?: string } | undefined => {
    return fieldPath.split('.').reduce((acc, key) => acc?.[key], errors);
};

const handleError = (form: UseFormReturn<StepperFormValues>, errors: FieldErrors<StepperFormValues>, activeStep: number) => {

    let firstErrorMessage: string | undefined;
    const currentStepFields = stepFields[activeStep] ?? Object.keys(errors);

    // Dynamically collect all possible field paths (including nested arrays)
    const collectFieldPaths = (fields: any, parentPath = ""): string[] => {
        return Object.entries(fields).flatMap(([key, value]) => {
            const path = parentPath ? `${parentPath}.${key}` : key;
            if (Array.isArray(value)) {
                // Handle arrays: Traverse each index recursively
                return value.flatMap((_, index) =>
                    collectFieldPaths(value[index] ?? {}, `${path}.${index}`)
                );
            } else if (typeof value === "object" && value !== null) {
                // Recurse nested objects
                return collectFieldPaths(value, path);
            }
            return path; // Return the final path for scalar values
        });
    };

    // Collect all dynamic fields in the current step
    const dynamicFields = collectFieldPaths(form.getValues(), "").filter((field) =>
        currentStepFields.some((stepField) => field.startsWith(stepField))
    );

    for (const key of dynamicFields) {
        const error = getNestedError(errors, key);
        if (error) {
            firstErrorMessage = error.message;
            break;
        }
    }

    if (firstErrorMessage) {
        toast.error(firstErrorMessage);
    }
}
