'use client'

import Papa from 'papaparse';
import React from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export const RowSchema = z.object({
    name: z.string().trim().min(1, "Name required").regex(/^[A-Za-z ]+$/, "Only letters and spaces allowed"),
    email: z.string().email("Invalid email"),
    age: z.coerce.number().int().positive("Age must be ≥1"),
});

export type Row = z.infer<typeof RowSchema>;
type RowErrors = Record<number, Partial<Record<keyof Row, string[]>>>;

export async function saveRows(rows: Row[]) {
    const parsed = RowSchema.array().safeParse(rows);
    if (!parsed.success) throw new Error("Server-side validation failed");
    console.log("✔️ rows accepted:", parsed.data.length);
    console.log("✔️ data:", parsed.data);
}

export default function CsvUpload() {
    const [rows, setRows] = React.useState<Row[]>([]);
    const [errors, setErrors] = React.useState<RowErrors>({});
    const [duplicateEmailIndexes, setDuplicateEmailIndexes] = React.useState<Set<number>>(new Set());

    const [editingRow, setEditingRow] = React.useState<number | null>(null);
    const [editingField, setEditingField] = React.useState<keyof Row | null>(null);

    // Function to check for duplicate emails
    const checkDuplicateEmail = (email: string, index: number): string | null => {
        const duplicate = rows.find((row, idx) => row.email === email && idx !== index);
        return duplicate ? "Email is already taken" : null;
    };

    // Function to check for duplicate emails across all rows
    const checkForDuplicateEmails = (rows: Row[]): Set<number> => {
        const seenEmails: Map<string, Set<number>> = new Map();
        const duplicateIndexes = new Set<number>();

        rows.forEach((row, idx) => {
            const email = row.email.trim().toLowerCase();
            if (seenEmails.has(email)) {
                seenEmails.get(email)?.add(idx);
                duplicateIndexes.add(idx);
            } else {
                seenEmails.set(email, new Set([idx]));
            }
        });

        return duplicateIndexes;
    };

    // Upload CSV and validate
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse<Row>(file, {
            header: true,
            skipEmptyLines: true,
            complete: ({ data }: any) => {
                const fieldErrors: RowErrors = {};

                data.forEach((row: any, index: number) => {
                    const result = RowSchema.safeParse(row);
                    if (!result.success) {
                        const rowErr: Partial<Record<keyof Row, string[]>> = {};
                        for (const err of result.error.errors) {
                            const key = err.path[0] as keyof Row;
                            if (!rowErr[key]) rowErr[key] = [];
                            rowErr[key]!.push(err.message);
                        }
                        fieldErrors[index] = rowErr;
                    }
                    // Check for duplicate email after parsing
                    const duplicateError = checkDuplicateEmail(row.email, index);
                    if (duplicateError) {
                        if (!fieldErrors[index]) fieldErrors[index] = {};
                        fieldErrors[index]!.email = [duplicateError];
                    }
                });

                setRows(data);
                setErrors(fieldErrors);

                // Check for duplicate emails and highlight them
                const duplicateIndexes = checkForDuplicateEmails(data);
                setDuplicateEmailIndexes(duplicateIndexes);

                if (duplicateIndexes.size > 0) {
                    toast.error("Duplicate emails detected in the uploaded file. Please fix the duplicates.");
                }
            },
        });
    };

    // Edit a specific cell
    const edit = (i: number, field: keyof Row, value: string) => {
        setRows(r => {
            const updated = [...r];
            (updated[i] as any)[field] = value;

            // Revalidate the edited row
            const result = RowSchema.safeParse(updated[i]);
            let fieldErrors: Partial<Record<keyof Row, string[]>> = {};

            // Check for duplicate email if email field is edited
            if (field === "email") {
                const duplicateError = checkDuplicateEmail(value, i);
                if (duplicateError) {
                    fieldErrors.email = [duplicateError];
                }
            }

            // If row validation fails, gather errors
            if (!result.success || Object.keys(fieldErrors).length > 0) {
                // Add schema validation errors
                if (!result.success) {
                    for (const err of result.error.errors) {
                        const path = err.path[0] as keyof Row;
                        fieldErrors[path] = fieldErrors[path] || [];
                        fieldErrors[path]!.push(err.message);
                    }
                }
                // Set errors for this row
                setErrors(prevErrors => {
                    const copy = { ...prevErrors };
                    copy[i] = fieldErrors;
                    return copy;
                });
            } else {
                // Remove errors for this row if valid
                setErrors(prevErrors => {
                    const copy = { ...prevErrors };
                    delete copy[i];
                    return copy;
                });
            }

            // Check if there are duplicates after editing the email
            const duplicateIndexes = checkForDuplicateEmails(updated);
            setDuplicateEmailIndexes(duplicateIndexes);

            return updated;
        });
    }

    // Delete a row
    const deleteRow = (index: number) => {
        setRows(prev => prev.filter((_, i) => i !== index));

        // Also remove any errors associated with this row and reindex others
        setErrors(prev => {
            const updated: RowErrors = {};
            Object.entries(prev).forEach(([key, value]) => {
                const idx = parseInt(key);
                if (idx < index) updated[idx] = value;
                else if (idx > index) updated[idx - 1] = value; // shift down
            });
            return updated;
        });
    };

    // Add a new row
    const addRow = () => {
        const newRow: Row = { name: "", email: "", age: 0 };
        const duplicateError = checkDuplicateEmail(newRow.email, rows.length);

        setRows(prev => [...prev, newRow]);
        setErrors(prev => ({
            ...prev,
            [rows.length]: duplicateError
                ? { email: [duplicateError] }
                : {
                    name: ["Name required"],
                    email: ["Invalid email"],
                    age: ["Age must be ≥1"],
                },
        }));
    };

    // Submit/save rows
    const save = async () => {
        // Check for duplicates before saving
        const duplicateIndexes = checkForDuplicateEmails(rows);
        setDuplicateEmailIndexes(duplicateIndexes);

        if (duplicateIndexes.size > 0) {
            toast.error("Duplicate emails detected. Please fix the duplicates.");
            return;
        }

        try {
            await saveRows(rows);
            toast.success('Rows saved!');
        } catch {
            toast.error("Server validation failed");
        }
    };

    // Export updated csv
    const exportCSV = () => {
        const csv = Papa.unparse(rows);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "updated_data.csv");
        link.click();
    };

    // const fields = Object.keys(RowSchema.shape) as (keyof Row)[];
    const totalErrors = Object.values(errors).reduce(
        (sum, rowErrs) => sum + Object.values(rowErrs).flat().length,
        0
    );

    return (
        <>
            <div className="space-y-4">
                <div className='flex justify-between items-center'>
                    <input type="file" accept=".csv" onChange={handleFile}
                        className="file:px-4 file:py-1 file:rounded file:bg-blue-600 file:text-white border-0" />

                    {rows.length > 0 && (
                        <Button
                            type='button'
                            variant={'outline'}
                            onClick={addRow}
                        >
                            Add Row
                        </Button>
                    )}
                </div>

                {rows.length > 0 && (
                    <>
                        <p>Total Errors:{totalErrors}</p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {["Name", "Email", "Age", "Status", "Delete"].map(h => (
                                            <th key={h} className="p-2 border text-left">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, i) => (
                                        <tr key={i} className="odd:bg-gray-50">
                                            {(["name", "email", "age"] as const).map(f => (
                                                <td key={f} className="border">
                                                    <input
                                                        value={row[f] ?? ""}
                                                        onChange={e => edit(i, f, e.target.value)}
                                                        onFocus={() => {
                                                            setEditingRow(i);
                                                            setEditingField(f);
                                                        }}
                                                        onBlur={() => {
                                                            setEditingRow(null);
                                                            setEditingField(null);
                                                        }}
                                                        className={`
                                                            w-full bg-transparent outline-none p-2
                                                            ${duplicateEmailIndexes.has(i) && f === "email" && editingRow !== i
                                                                ? 'bg-yellow-50 border border-yellow-400' : ''}
                                                            ${errors[i]?.[f] ? 'border border-red-500 bg-red-100' : ''}
                                                            ${editingRow === i && editingField === f ? "bg-background" : ""}
                                                        `}
                                                    />
                                                </td>
                                            ))}

                                            {/* Status */}
                                            <td className="border p-2">
                                                {errors[i]
                                                    ? <ul className="text-red-600 text-xs list-disc list-inside">
                                                        {Object.values(errors[i]!).flat().map((err, idx) => (
                                                            <li key={idx}>{err}</li>
                                                        ))}
                                                    </ul>
                                                    : <span className="text-green-600">✔︎</span>}
                                            </td>

                                            {/* Delete button */}
                                            <td className="border p-2 text-center">
                                                <button onClick={() => deleteRow(i)}>
                                                    <Trash2 size={16} className='text-destructive' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='flex gap-2 justify-end'>
                            <Button
                                type='button'
                                onClick={save}
                                className="bg-emerald-600 text-white"
                            >
                                Save
                            </Button>

                            <Button
                                type='button'
                                onClick={exportCSV}
                            >
                                Export
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}