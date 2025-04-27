import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const session = await auth();
        const userId: string = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        
        const { endpoint } = await req.json();

        if (!endpoint) {
            return NextResponse.json({ success: false, message: "Invalid subscription object" }, { status: 400 });
        }

        const existingSubscription = await prisma.subscription.findFirst({
            where: { userId, endpoint },
        });

        return NextResponse.json({ valid: !!existingSubscription });
    } catch (error) {
        console.error("Failed to verify subscription", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
