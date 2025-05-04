import { Metadata } from 'next';

import StepperForm from '@/components/_stepper-form/StepperForm';

export const metadata: Metadata = {
    title: "Stepper Form",
    description: "Multi-step form",
};

export default function StepperPage() {
    return (
        <StepperForm />
    );
}