import { z } from 'zod';

import { validateUniqueFields } from '@/utils/validateUniqueFields';
import {
    AlphabeticOnlySchema, DateSchema, EmailSchema, MobileSchema, RequiredString,
} from '@/validations/common';

const emergencyContactsSchema = z.object({
    name: AlphabeticOnlySchema("Name is required"),
    phone: MobileSchema,
})

export const sampleFormSchema = z.object({
    firstName: AlphabeticOnlySchema("First Name is required"),
    middleName: z.string().optional(),
    lastName: AlphabeticOnlySchema("Last Name is required"),
    dob: DateSchema({ isDob: true }),
    gender: RequiredString("Please select a gender"),
    bloodGroup: RequiredString("Please select a blood group"),
    email: EmailSchema,
    mobile: MobileSchema,
    alternateMobile: z.string().optional(),

    location: z.object({
        addressLine1: RequiredString("Address Line 1 is required"),
        addressLine2: z.string().optional(),
        addressLine3: z.string().optional(),
        country: RequiredString("Please select a country"),
        state: RequiredString("Please select a state"),
        city: RequiredString("Please select a city"),
    }),

    emergencyContacts: z.array(emergencyContactsSchema)
        .superRefine((data, ctx) => {
            validateUniqueFields(data, ctx, ["phone"], {
                phone: "Mobile No. already exist",
            });
        }).optional(),
});

export type StepperFormValues = z.infer<typeof sampleFormSchema>;

export const stepFields: Record<number, (keyof StepperFormValues)[]> = {
    1: ["firstName", "middleName", "lastName", "dob", "gender", "bloodGroup"],
    2: ["location"],
    3: ["email", "mobile", "alternateMobile"],
    4: ["emergencyContacts"],
};