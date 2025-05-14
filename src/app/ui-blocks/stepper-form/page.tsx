import StepperForm from '@/components/_stepper-form/StepperForm';

export const metadata = {
    title: "Stepper Form",
    description: "Multi-step form",
};

export default async function StepperPage() {
    return (
        <StepperForm />
    );
}