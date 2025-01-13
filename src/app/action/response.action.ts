import { NextResponse } from "next/server"

export async function handleSuccess(message: string, data: unknown) {
    return NextResponse.json(
        { success: true, message, data },
        { status: 200 }
    );
}

export async function handleNoId(message: string) {
    console.error(message);
    return NextResponse.json(
        { success: false, message },
        { status: 400 }
    );
}

export async function handleError(message: string, error: unknown) {
    console.error(message, error);
    return NextResponse.json(
        { success: false, message },
        { status: 500 }
    );
}

export async function handleNotFound() {
    console.error('Invalid endpoint');
    return NextResponse.json(
        { success: false, message: "Invalid endpoint" },
        { status: 404 }
    );
}