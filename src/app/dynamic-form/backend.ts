import { FormFields } from "./schema";

type formConfig = {
    fields: FormFields[];
    steps: {
        title: string;
        fields: string[]
    }[];
    layout: {
        columns: number;
    }
}

export const backendForm: formConfig = {
    fields: [
        { name: 'fullName', label: 'Full Name', type: 'TEXT', required: true, validations: { minLength: 3, maxLength: 5 } },
        { name: 'gender', label: 'Gender', type: 'SELECT', required: true, endpoint: '/api/options/gender', startColumn: 1 },
        { name: 'dob', label: 'Date of Birth', type: 'DATE', startColumn: 3 },
        { name: 'email', label: 'Email Address', type: 'EMAIL', required: true, colSpan: 2 },
        {
            name: 'department', label: 'Department', type: 'SELECT', required: true,
            endpoint: '/api/options/departments'

        },
        { name: 'startDate', label: 'Start Date', type: 'DATE' },
        { name: 'address', label: 'Address', type: 'TEXTAREA', colSpan: 3, rowSpan: 2 },
        { name: 'branch', label: 'Branch', type: 'TEXT', showIf: { field: 'department', value: 'eng' } },
        { name: 'agreement', label: 'Agree to Terms', type: 'CHECKBOX', required: true },
    ],
    steps: [
        {
            title: 'Personal Info',
            fields: ['fullName', 'dob', 'gender', 'email'],
        },
        {
            title: 'Work Info',
            fields: ['department', 'branch', 'startDate', 'address'],
        },
        {
            title: 'Consent',
            fields: ['agreement'],
        }
    ],
    layout: {
        columns: 3
    }
};