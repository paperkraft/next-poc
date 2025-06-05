'use client'

import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { backendForm } from './backend';
import { FieldComponent } from './form-components';
import { FormFields, generateZodSchema } from './schema';
import { cn } from '@/lib/utils';

export default function DynamicFormRenderer() {

    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = backendForm.steps.length;

    const step = backendForm.steps[currentStep];
    const isLastStep = currentStep === totalSteps - 1;

    const form = useForm({
        resolver: zodResolver(generateZodSchema(backendForm.fields)),
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

    // const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    // const schema = generateZodSchema(backendForm.fields.filter(f => step.fields.includes(f.name)));

    const onSubmit = (data: any) => {
        if (!isLastStep) {
            nextStep();
            return;
        }
        console.log('Final submitted data:', data);
    };

    console.log('errors:', errors);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md space-y-6"
        >
            <h2 className="text-lg font-semibold mb-4">{step.title}</h2>
            <div className={`grid grid-cols-1 lg:grid-cols-${backendForm.layout.columns ?? 1} gap-6`}>
                {step.fields.map((fieldName) => {
                    const field = backendForm.fields.find(f => f.name === fieldName);
                    if (!field || !shouldShowField(field)) return null;
                    const colSpan = field.colSpan ? `lg:col-span-${field.colSpan}` : '';
                    return (
                        <div key={field.name} className={cn(colSpan)}>
                            <label htmlFor={field.name} className="mb-1 font-medium text-gray-700">{field.label}</label>
                            <FieldComponent field={field} register={register} control={control} />
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
