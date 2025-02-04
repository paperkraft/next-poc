export const STEPPER_FORM_KEYS = {
    1: ['firstName', 'lastName'],
    2: ['address', 'city', 'state', 'zipCode'],
    5: ['bankName', 'accountNumber', 'creditScore'],
} as const;

export type StepperFormKeysType =
    (typeof STEPPER_FORM_KEYS)[keyof typeof STEPPER_FORM_KEYS][number];

export type StepperFormValues = {
    [FieldName in StepperFormKeysType]: FieldName extends
    | "annualIncome"
    | "loanAmount"
    | "repaymentTerms"
    | "creditScore"
    ? number
    : string;
};