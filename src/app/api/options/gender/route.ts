import { NextResponse } from 'next/server';

export async function GET() {
    const departments = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ];
    return NextResponse.json(departments);
}