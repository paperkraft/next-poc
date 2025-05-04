'use client'
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import DynamicFormComponent from "@/components/custom/dynamic-components";
import useModuleIdByName from "@/hooks/use-module-id";
import { usePathname, useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/PermissionGuard";

async function fetchFormMetadata() {
    const res = await fetch('/api/json-data');
    if (!res.ok) {
        throw new Error('Failed to fetch form metadata');
    }
    return await res.json();
}

export default function SampleForm() {

    const route = useRouter();
    const path = usePathname();
    const moduleId = useModuleIdByName("Student") as string;

    const [formFields, setFormFields] = useState<object>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadFormData() {
            try {
                const data = await fetchFormMetadata();
                setFormFields(data);
            } catch (err:any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadFormData();
    }, [])

    const dynamicSchema = formFields && z.object(createZodSchema(formFields));
    const defaultValues = formFields && createDefaultValues(formFields);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <PermissionGuard action="WRITE" path={path}>
                <div className="flex justify-end">
                    <Button onClick={()=>route.push(`${path}/schema`)} variant={'outline'}>Schema</Button>
                </div>
            </PermissionGuard>
            {dynamicSchema && formFields && defaultValues &&
            <FormTemplate data={formFields} schema={dynamicSchema} defaultValues={defaultValues} />}
        </>
    );
}

type Props = {
    data: object;
    schema: any;
    defaultValues: object;
}

const FormTemplate = React.memo(({ data, schema, defaultValues }: Props) => {
    type FormValues = z.infer<typeof schema>
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues
    });

    const onSubmit = (data: FormValues) => {
        console.log(JSON.stringify(data, null, 2));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
                {data && <DynamicFormComponent formFields={data} />}
                <div className='flex justify-end gap-2'>
                    <Button type="button" variant="outline" onClick={()=> form.reset()}>Reset</Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
})

FormTemplate.displayName = 'FormTemplate';


function createDefaultValues(data: Record<string, any>) {
    const defaultValues: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
        const field = data[key];

        if (field && typeof field === 'object' && !Array.isArray(field)) {
            // Handling nested fields (e.g., Location with nested fields)
            if (field.fields) {
                defaultValues[key] = createDefaultValues(field.fields);
            } else {
                // Handle different field types (String, Boolean, etc.)
                defaultValues[key] = handleFieldDefaultValue(field);
            }
        } else {
            // Handle non-object fields (String, Boolean, etc.)
            defaultValues[key] = handleFieldDefaultValue(field);
        }
    });

    return defaultValues;
}

// Helper function to handle the default value assignment based on field type
function handleFieldDefaultValue(field: any) {
    switch (field.type) {
        case 'Boolean':
            return field.value !== undefined ? field.value : false;
        case 'String':
            return field.value || '';
        case 'Number':
            return field.value || 0;
        case 'Select':
            return field.value || '';
        case 'Date':
            return field.value || new Date();
        default:
            return field.value || '';
    }
}


function createZodSchema(data: Record<string, any>) {
    const schemaFields: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
        const field = data[key];
        const isRequired = field.required === true;
        const customMessage = field.message || "This field is required";

        // Handle nested objects (e.g., Location with fields)
        if (field && typeof field === 'object' && !Array.isArray(field)) {
            if (field.fields) {
                // Recursively handle nested fields
                schemaFields[key] = z.object(createZodSchema(field.fields)); // Nested field validation
            } else {
                // Handle simple field types directly (e.g., String, Number, Boolean)
                schemaFields[key] = handleFieldValidation(field, isRequired, customMessage);
            }
        } else {
            // Handle simple field types directly
            schemaFields[key] = handleFieldValidation(field, isRequired, customMessage);
        }
    });

    return schemaFields;
}

// Helper function to handle Zod validation
function handleFieldValidation(field: any, isRequired: boolean, customMessage: string) {
    switch (field.type) {
        case 'String':
            return isRequired
                ? z.string().min(1, customMessage)
                : z.string().optional();
        case 'Number':
            return isRequired
                ? z.number().min(1, customMessage)
                : z.number().optional();
        case 'Boolean':
            return isRequired
                ? z.boolean().refine(value => value === true || value === false, customMessage)
                : z.boolean().optional();
        case 'Date':
            return isRequired
                // ? z.coerce.date().refine(date => date instanceof Date && !isNaN(date.getTime()), customMessage)
                ? z.coerce.date({ errorMap:() => ({ message: customMessage ?? "Date is required."}) })
                : z.coerce.date().optional();
        case 'Select':
            return handleSelectField(field, isRequired, customMessage);
        case 'Object':
            // Handle nested object fields with `z.object()`
            return z.object(createZodSchema(field.fields));
        default:
            console.warn(`Unhandled type for field: ${field.type}`);
            return z.unknown(); // Default to unknown for unsupported types
    }
}

// Handle Select type fields (dropdowns)
function handleSelectField(field: any, isRequired: boolean, customMessage: string) {
    const options = field.options || [];
    const values = options.map((option: any) => option.value);

    if (isRequired) {
        return z.string().refine(value => values.includes(value), customMessage);
    }

    return z.string().optional();
}