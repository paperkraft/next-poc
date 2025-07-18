import { Metadata } from 'next';

import FormBuilder from '@/components/_form-builder';

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Customize form",
};

export default function Page() {
  return (
    <FormBuilder />
  );
}