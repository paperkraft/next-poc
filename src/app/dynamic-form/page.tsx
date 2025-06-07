'use client'

import { useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { backendForm } from './backend';
import { FieldComponent } from './form-components';
import { FormFields, generateZodSchema, SelectOptions } from './schema';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { z } from 'zod';

export default function DynamicFormRenderer() {

    const { isMobile } = useSidebar();
    const [currentStep, setCurrentStep] = useState(0);
    const [asyncOptions, setAsyncOptions] = useState<Record<string, SelectOptions[]>>({});

    const fetchedStepsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        async function fetchAsyncOptionsForStep() {
            if (fetchedStepsRef.current.has(currentStep)) return;

            const stepFields = backendForm.steps[currentStep].fields;
            const asyncFields = backendForm.fields.filter(
                (f) => stepFields.includes(f.name) && f.endpoint
            );

            const newOptions: Record<string, SelectOptions[]> = {};
            for (const field of asyncFields) {
                try {
                    if (field.endpoint) {
                        const res = await fetch(field.endpoint);
                        const data = await res.json();
                        newOptions[field.name] = data;
                    }
                } catch (err) {
                    console.error(`Failed to fetch options for ${field.name}`, err);
                }
            }

            setAsyncOptions((prev) => ({ ...prev, ...newOptions }));
            fetchedStepsRef.current.add(currentStep);
        }

        fetchAsyncOptionsForStep();
    }, [currentStep]);

    const totalSteps = backendForm.steps.length;

    const step = backendForm.steps[currentStep];
    const isLastStep = currentStep === totalSteps - 1;

    const schema = generateZodSchema(backendForm.fields);
    type FormFieldsValues = z.infer<typeof schema>;

    const form = useForm<FormFieldsValues>({
        resolver: zodResolver(schema),
        defaultValues: {} as FieldValues,
        shouldUnregister: false,
        mode: 'onChange',
    });

    const { register, handleSubmit, control, watch, trigger, formState: { errors } } = form;

    const watchAll = watch();

    const shouldShowField = (field: FormFields) => {
        if (!field.showIf) return true;
        const depValue = watchAll[field.showIf.field];
        return depValue === field.showIf.value;
    };

    const nextStep = async () => {
        const stepFields = step.fields;
        const valid = await trigger(stepFields);
        if (valid) setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const onSubmit = (data: FormFieldsValues) => {
        if (!isLastStep) {
            nextStep();
            return;
        }
        console.log('Final submitted data:', data);
    };

    // console.log('errors:', errors);
    const { columns } = backendForm.layout;

    function getGridStyle(field: FormFields) {
        const colStart = field.startColumn || 'auto';
        const rowStart = field.startRow || 'auto';
        const colSpan = field.colSpan || 1;
        const rowSpan = field.rowSpan || 1;

        return {
            gridColumn: `${isMobile ? 'auto' : colStart} / span ${isMobile ? 1 : colSpan}`,
            gridRow: `${isMobile ? 'auto' : rowStart} / span ${isMobile ? 1 : rowSpan}`,
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-3xl mx-auto w-full md:w-[786px] p-6 border rounded-md shadow-md space-y-6"
        >
            <h2 className="text-lg font-medium mb-4">{step.title}</h2>

            <div className={`grid grid-cols-1 lg:grid-cols-${columns ?? 1} gap-6`}>

                {step.fields.map((fieldName) => {
                    const field = backendForm.fields.find(f => f.name === fieldName);
                    if (!field || !shouldShowField(field)) return null;

                    return (
                        <div
                            key={field.name}
                            className={cn('flex flex-col gap-1')}
                            style={getGridStyle(field)}
                        >
                            <label htmlFor={field.name} className="text-sm">{field.label}</label>
                            <FieldComponent
                                field={field}
                                register={register}
                                control={control}
                                selectOptions={asyncOptions}
                            />
                            {errors[field.name] && (
                                <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message as string}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between mt-8">
                {currentStep > 0 && (
                    <Button variant="outline" type="button" onClick={prevStep}>
                        Back
                    </Button>
                )}
                {isLastStep ? (
                    <Button type="submit">Submit</Button>
                ) : (
                    <Button type="button" onClick={nextStep} className='ml-auto'>Next</Button>
                )}
            </div>
        </form>
    );
}