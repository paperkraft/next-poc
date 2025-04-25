import { Metadata } from 'next';

import FormBuilder from '@/components/_form-builder';
import AccessDenied from '@/components/custom/access-denied';
import { PermissionGuard } from '@/components/PermissionGuard';

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Customize form",
};

export default function Page() {
  return (
    <PermissionGuard action={'READ'} fallback={<AccessDenied/>}>
      <FormBuilder />
    </PermissionGuard>
  );
}