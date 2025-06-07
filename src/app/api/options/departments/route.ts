// app/api/options/departments/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const departments = [
        { label: 'Engineering', value: 'eng' },
        { label: 'Marketing', value: 'mkt' },
        { label: 'Human Resources', value: 'hr' },
        { label: 'Finance', value: 'fin' }
    ];
    return NextResponse.json(departments);
}