import { RowData, RowErrors, SelectedField, SortConfig } from "./types"
import Papa from "papaparse"
import { z } from 'zod';

export async function saveRows(rows: RowData[], schema: z.ZodObject<any>) {
    const parsed = schema.array().safeParse(rows)
    if (!parsed.success) throw new Error("Server-side validation failed")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return parsed.data
}

export const validateRow = (row: RowData, index: number, allRows: RowData[], schema: z.ZodObject<any>) => {
    const result = schema.safeParse(row)
    const fieldErrors: Partial<Record<keyof RowData, string[]>> = {}

    if (!result.success) {
        for (const err of result.error.errors) {
            const path = err.path[0] as keyof RowData
            fieldErrors[path] = fieldErrors[path] || []
            fieldErrors[path]!.push(err.message)
        }
    }

    // Check for duplicate emails
    if (row.email) {
        const duplicateIndex = allRows.findIndex((r, idx) => r.email === row.email && idx !== index)
        if (duplicateIndex !== -1) {
            fieldErrors.email = fieldErrors.email || []
            fieldErrors.email!.push("Email already exists")
        }
    }

    return fieldErrors
}

export const validateAllRows = (rows: RowData[], schema: z.ZodObject<any>) => {
    const newErrors: RowErrors = {}
    const duplicateIndexes = new Set<number>()

    // First pass to find all duplicate emails
    const emailMap = new Map<string, number[]>()
    rows.forEach((row, index) => {
        if (row.email) {
            const normalizedEmail = row.email.toLowerCase().trim()
            if (!emailMap.has(normalizedEmail)) {
                emailMap.set(normalizedEmail, [])
            }
            emailMap.get(normalizedEmail)!.push(index)
        }
    })

    // Mark duplicates
    emailMap.forEach((indexes) => {
        if (indexes.length > 1) {
            indexes.forEach(index => duplicateIndexes.add(index))
        }
    })

    // Validate each row
    rows.forEach((row, index) => {
        const rowErrors = validateRow(row, index, rows, schema)
        if (Object.keys(rowErrors).length > 0) {
            newErrors[index] = rowErrors as any
        }
    })

    return { errors: newErrors, duplicateIndexes }
}

export const sortData = (data: RowData[], config: SortConfig): RowData[] => {
    if (!config.field || !config.direction) return data

    return [...data].sort((a, b) => {
        const aValue = a[config.field!]
        const bValue = b[config.field!]

        let comparison = 0
        if (config.field === "age") {
            comparison = Number(aValue) - Number(bValue)
        } else {
            comparison = String(aValue).localeCompare(String(bValue))
        }

        return config.direction === "asc" ? comparison : -comparison
    })
}

export const filterData = (data: RowData[], query: string): RowData[] => {
    if (!query.trim()) return data
    return data.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
        )
    )
}

export const exportToCsv = (data: RowData[]) => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `data_${new Date().getTime()}.csv`)
    link.click()
}

export const generateSchema = (selectedFields: SelectedField[]) => {
    const schemaObj: Record<string, z.ZodTypeAny> = {};

    selectedFields.forEach(field => {
        let fieldSchema: z.ZodTypeAny;

        // Base type
        switch (field.type) {
            case 'number':
                fieldSchema = z.coerce.number().int().positive("Must be ≥1");
                break;
            case 'textOnly':
                if (field.required) {
                    fieldSchema = z.string().min(1, `${field.name} is required`).trim().regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed");
                }
                fieldSchema = z.string().trim().regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed");
                break;
            case 'email':
                fieldSchema = z.string().trim().email("Invalid email format");
                break;
            case 'date':
                fieldSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");
                break;
            default:
                if (field.required) {
                    fieldSchema = z.string().min(1, `${field.name} is required`).trim();
                }
                fieldSchema = z.string().trim();
        }

        // Required validation
        if (field.required) {
            fieldSchema = fieldSchema;
        }

        schemaObj[field.name] = fieldSchema;
    });

    return z.object(schemaObj);
};