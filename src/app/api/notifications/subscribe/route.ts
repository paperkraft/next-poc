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

        const { subscription, topics } = await req.json();

        console.log('topics');
        

        const endpoint: string | undefined = subscription?.endpoint;

        if (!endpoint) {
            return NextResponse.json({ success: false, message: "Invalid subscription object" }, { status: 400 });
        }

        const existing = await prisma.subscription.findUnique({
            where: { userId, endpoint },
        });

        if (existing) {
            // Update the topic if needed
            await prisma.subscription.update({
                where: { id: existing.id },
                data: {
                    subscription,
                    topics:{
                        set: Array.from(new Set([...existing.topics, ...topics]))
                    }
                },
            });

            return NextResponse.json({ success: true, message: "Subscription updated" });
        }

        // Store the new subscription in the database
        await prisma.subscription.create({
            data: {
                userId,
                subscription,
                endpoint,
                topics
            },
        });

        return NextResponse.json({ success: true, message: "Subscription created" });
    } catch (error) {
        console.error("Failed to save subscription", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        const userId: string | undefined = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { endpoint } = await req.json();

        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });
        }

        await prisma.subscription.deleteMany({
            where: { userId, endpoint },
        });

        return NextResponse.json({ success: true, message: "Subscription deleted" });
    } catch (error) {
        console.error("Failed to delete subscription", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}