"use client";

import { motion } from 'framer-motion';
import { BriefcaseMedical, MapPin, Phone, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
    clearForm, InitialFormValue, updateForm, updateStep
} from '@/redux/slice/stepper-form-slice';
import { persistor, RootState } from '@/redux/store';
import { sampleFormSchema, stepFields, StepperFormValues } from '@/types/sample-form';
import { handleFormError } from '@/utils/form-error-handler';

import StepperIndicator from './StepperIndicator';
import { useZodStepperForm } from './useFormHook';

const StepOne = dynamic(() => import("./(forms)/step-one/page"), { loading: () => <p>Loading...</p> });
const StepTwo = dynamic(() => import("./(forms)/step-two/page"), { loading: () => <p>Loading...</p> });
const StepThree = dynamic(() => import("./(forms)/step-three/page"), { loading: () => <p>Loading...</p> });
const StepFour = dynamic(() => import("./(forms)/step-four/page"), { loading: () => <p>Loading...</p> });

const stepComponents = [StepOne, StepTwo, StepThree, StepFour];
const stepIcons = [<User />, <MapPin />, <Phone />, <BriefcaseMedical />];

export default function StepperForm() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Destructuring activestep, and form data from the store
    const { activeStep: storeStep, formData } = useSelector((state: RootState) => state.stepperForm);

    const handleUpdate = React.useCallback((data: StepperFormValues) => {
        dispatch(updateForm(data));
    }, []);

    const {
        form,
        activeStep,
        steps,
        prevValues,
        goToNextStep,
        goToPrevStep,
        setStep
    } = useZodStepperForm({
        schemas: sampleFormSchema,
        defaultValues: InitialFormValue as unknown as StepperFormValues,
        stepFields,
        onUpdate: (data) => handleUpdate(data),
    });

    React.useEffect(() => {
        if (storeStep && storeStep !== activeStep) {
            setStep(storeStep);
        }
    }, []);

    React.useEffect(() => {
        if (storeStep !== activeStep) {
            dispatch(updateStep(activeStep));
        }
    }, [storeStep, activeStep, dispatch]);

    // Reset the form data whenever the form in the store changes
    React.useEffect(() => {
        if (JSON.stringify(prevValues.current) !== JSON.stringify({ ...formData })) {
            form.reset(formData);
        }
    }, [formData]);

    const onSubmit = async (formData: StepperFormValues) => {
        console.log("Form submitted:", formData);
        const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Form submitted successfully!' }), 2000));

        toast.promise(promise, {
            loading: 'Loading...',
            success: () => {
                dispatch(clearForm());
                persistor.purge();
                setStep(1);
                router.refresh();
                return `Form submitted successfully!`;
            },
            error: 'Error',
        });
    }

    const StepComponent = stepComponents[activeStep - 1];
    const stepContainerRef = React.useRef<HTMLDivElement>(null);

    // Focus management
    React.useEffect(() => {
        // wait for the component for this step to mount
        const timer = requestAnimationFrame(() => {
            // wait until motion.div finished laying out children
            stepContainerRef.current?.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )?.focus();
        });

        return () => cancelAnimationFrame(timer);
    }, [activeStep]);

    return (
        <>
            <StepperIndicator
                activeStep={activeStep}
                steps={steps}
                stepIcons={stepIcons}
                icons
                onStepClick={async (targetStep) => {
                    if (targetStep > activeStep) {
                        const ok = await form.trigger(stepFields[targetStep - 1]);
                        if (!ok) return;
                    }
                    setStep(targetStep);
                }}
            />

            <Form {...form}>
                <div className="space-y-4">
                    <motion.div
                        key={activeStep}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        ref={stepContainerRef}
                    >
                        {StepComponent && <StepComponent />}
                    </motion.div>

                    <div className="flex justify-between px-4">
                        <Button
                            type="button"
                            className={cn("w-[100px]", { 'invisible': activeStep === 1 })}
                            variant="secondary"
                            onClick={goToPrevStep}
                            disabled={activeStep === 1}
                        >
                            Back
                        </Button>
                        {activeStep === steps ? (
                            <Button
                                type="button"
                                className="w-[100px]"
                                onClick={form.handleSubmit(onSubmit,
                                    (errors) => handleFormError(form, errors))
                                }
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                className="w-[100px]"
                                onClick={goToNextStep}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </Form>
        </>
    );
}