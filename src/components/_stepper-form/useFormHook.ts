import React from 'react';
import { useForm, UseFormProps } from 'react-hook-form';
import { z, ZodObject } from 'zod';

import { handleFormError } from '@/utils/form-error-handler';
import { zodResolver } from '@hookform/resolvers/zod';

type StepSchemas<T extends z.ZodType<any>> = {
    schemas: T;
    stepFields: Record<number, (keyof z.infer<T>)[]>;
    defaultValues: z.infer<T>;
    mode?: UseFormProps<z.infer<T>>["mode"];
    shouldUnregister?: boolean;
    onUpdate?: (data: z.infer<T>) => void;
}

function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    const timeout = React.useRef<NodeJS.Timeout | null>(null);

    return React.useCallback((...args: Parameters<T>) => {
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function useZodStepperForm<T extends ZodObject<any>>({
    schemas,
    stepFields,
    defaultValues,
    mode = 'onChange',
    shouldUnregister = false,
    onUpdate
}: StepSchemas<T>) {

    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schemas),
        defaultValues: defaultValues as any,
        shouldUnregister,
        mode,

    });

    const steps = Object.keys(stepFields).length;
    const [activeStep, setActiveStep] = React.useState(1);
    const prevValues = React.useRef<z.infer<T> | null>(null);

    const stableOnUpdate = React.useCallback(onUpdate ?? (() => { }), [onUpdate]);

    const debouncedUpdateForm = useDebounce((data: z.infer<T>) => {
        const cloned = deepClone(data);
        if (JSON.stringify(prevValues.current) !== JSON.stringify(cloned)) {
            prevValues.current = cloned;
            stableOnUpdate(cloned);
        }
    }, 1000);

    React.useEffect(() => {
        const sub = form.watch((values) => {
            debouncedUpdateForm(values);
        });
        return () => sub.unsubscribe();
    }, [debouncedUpdateForm, form]);

    const goToNextStep = React.useCallback(async () => {
        if (activeStep === steps) return;

        const currentStepFields = stepFields[activeStep] || [];
        const valid = await form.trigger(currentStepFields as any, { shouldFocus: true });

        if (!valid) {
            handleFormError(form, form.formState.errors);
            return;
        }

        if (valid && activeStep < steps) {
            setActiveStep((s) => s + 1);
        }
        return valid;
    }, [form, activeStep, stepFields, steps]);

    const goToPrevStep = React.useCallback(() => {
        setActiveStep((s) => (s > 1 ? s - 1 : s));
    }, []);

    return {
        form,
        prevValues,
        activeStep,
        steps,
        goToNextStep,
        goToPrevStep,
        setStep: setActiveStep,
    };
}