import { z } from 'zod';

export type SelectOptions = {
    label: string;
    value: string;
}

export type FormFields = {
    name: string;
    label: string;
    type: string;

    required?: boolean;
    validations?: any;

    endpoint?: string;

    colSpan?: number;
    rowSpan?: number;
    startColumn?: number;
    startRow?: number;

    showIf?: {
        field: string;
        value: string;
    }
}
export function generateZodSchema(fields: FormFields[]) {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const field of fields) {
        let base: z.ZodTypeAny = z.any();

        // switch (field.type) {
        //     case 'TEXT':
        //     case 'TEXTAREA':
        //         base = z.string();
        //         if (field.validations?.minLength) base = (base as z.ZodString).min(field.validations.minLength);
        //         if (field.validations?.maxLength) base = (base as z.ZodString).max(field.validations.maxLength);
        //         break;
        //     case 'EMAIL':
        //         base = z.string().email();
        //         break;
        //     case 'SELECT':
        //         base = z.string();
        //         break;
        //     case 'CHECKBOX':
        //         base = z.boolean();
        //         break;
        //     case 'DATE':
        //         base = z.string();
        //         break;
        //     case 'NUMBER':
        //         base = z.number();
        //         break;
        // }

        // if (field.required) {
        //     if (base instanceof z.ZodString) {
        //         base = base.min(1, `${field.label} is required`);
        //     } else if (base instanceof z.ZodNumber) {
        //         base = base.min(1, `${field.label} is required`);
        //     } else if (base instanceof z.ZodBoolean) {
        //         base = base.refine(val => val === true, { message: `${field.label} must be checked` });
        //     }
        // }

        if (field.required) {
            switch (field.type) {
                case "TEXT":
                case "TEXTAREA":
                case "EMAIL":
                case "SELECT":
                case "RADIO":
                case "DATE":
                    base = z.string().min(1, `${field.label} is required`);
                    if (field.validations?.minLength) {
                        base = (base as z.ZodString)
                            .min(field.validations.minLength,
                                `${field.label} must be at least ${field.validations.minLength} character(s)`
                            );
                    }
                    if (field.validations?.maxLength) {
                        base = (base as z.ZodString)
                            .max(field.validations.maxLength,
                                `${field.label} must be at most ${field.validations.maxLength} character(s)`
                            );
                    }
                    break;
                case "NUMBER":
                    base = z.number().min(1, `${field.label} is required`);
                    break;
                case "CHECKBOX":
                    base = z.boolean().refine(val => val === true, {
                        message: `${field.label} must be checked`,
                    });
                    break;
                default:
                    break;
            }
        } else {
            switch (field.type) {
                case "TEXT":
                case "TEXTAREA":
                case "EMAIL":
                case "SELECT":
                case "RADIO":
                case "DATE":
                    base = z.string().optional();
                    break;
                case "NUMBER":
                    base = z.number().optional();
                    break;
                case "CHECKBOX":
                    base = z.boolean().optional();
                    break;
                default:
                    base = z.any();
            }
        }


        shape[field.name] = base;
    }

    return z.object(shape);
}