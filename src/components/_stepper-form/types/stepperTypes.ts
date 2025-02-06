export const STEPPER_FORM_KEYS = {
    1: ['firstName', 'middleName', 'lastName', 'dob', 'email'],
    2: ['address1', 'address2', 'city', 'state', 'zipCode'],
    5: ['bankName', 'accountNumber', 'creditScore'],
} as const;

export type StepperFormKeysType =
    (typeof STEPPER_FORM_KEYS)[keyof typeof STEPPER_FORM_KEYS][number];

export type StepperFormValues = {
    [FieldName in StepperFormKeysType]: FieldName extends
    | "zipCode"
    ? number
    : string;
};