export const backendForm = {
    fields: [
        { name: 'fullName', label: 'Full Name', type: 'TEXT', required: true, validations: { minLength: 3, maxLength: 5 } },
        { name: 'email', label: 'Email Address', type: 'EMAIL', required: true },
        {
            name: 'department', label: 'Department', type: 'SELECT', required: true, options: [
                { label: 'HR', value: 'hr' }, { label: 'Engineering', value: 'eng' }, { label: 'Marketing', value: 'mkt' }
            ]
        },
        { name: 'startDate', label: 'Start Date', type: 'DATE' },
        { name: 'address', label: 'Address', type: 'TEXTAREA', colSpan: 2 },
        { name: 'github', label: 'GitHub Profile', type: 'TEXT', showIf: { field: 'department', value: 'eng' } },
        { name: 'agreement', label: 'Agree to Terms', type: 'CHECKBOX', required: true },
    ],
    steps: [
        {
            title: 'Personal Info',
            fields: ['fullName', 'email'],
        },
        {
            title: 'Work Info',
            fields: ['department', 'startDate', 'address'],
        },
        {
            title: 'Consent',
            fields: ['github', 'agreement'],
        }
    ],
    layout: {
        columns: 2,
        fieldOrder: ['fullName', 'email', 'department', 'startDate', 'github', 'agreement']
    }
};