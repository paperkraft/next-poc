import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { endpoint, topic, action } = await req.json();

    if (!endpoint || !topic || !["subscribe", "unsubscribe"].includes(action)) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
        where: { endpoint },
    });

    if (!subscription) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (action === "subscribe") {
        if (!subscription.topics.includes(topic)) {
            await prisma.subscription.update({
                where: { endpoint },
                data: {
                    topics: {
                        push: topic
                    }
                }
            });
        }
    } else if (action === "unsubscribe") {
        await prisma.subscription.update({
            where: { endpoint },
            data: {
                topics: {
                    set: subscription.topics.filter(t => t !== topic)
                }
            }
        });
    }

    return NextResponse.json({ success: true });
}