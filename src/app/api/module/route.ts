import { createModule } from "@/lib/prisma-utils";
import { NextResponse } from "next/server";

export async function GET() {
    const res =  await createModule();
    return NextResponse.json({ message: 'Success', res }, { status: 200 });
}