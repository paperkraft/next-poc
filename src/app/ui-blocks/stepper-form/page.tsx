import { Metadata } from 'next';

import StepperForm from '@/components/_stepper-form/StepperForm';
import AccessDenied from '@/components/custom/access-denied';
import { PermissionGuard } from '@/components/PermissionGuard';

export const metadata: Metadata = {
    title: "Stepper Form",
    description: "Multi-step form",
};

export default function StepperPage() {
    return (
        <PermissionGuard action={'READ'} fallback={<AccessDenied/>}>
            <StepperForm />
        </PermissionGuard>
    );
}