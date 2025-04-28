import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import webpush, { PushSubscription } from 'web-push';

export async function POST(req: NextRequest) {
    const { title, body, topic } = await req.json();

    if (!title || !body || !topic) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch all subscriptions subscribed to the topic
    const subscriptions = await prisma.subscription.findMany({
        where: {
            topics: {
                has: topic
            }
        }
    });

    const payload = JSON.stringify({ title, body });

    const sendPromises = subscriptions.map(async (sub) => {
        try {
            const subscription: PushSubscription = JSON.parse(sub.subscription as string);
            await webpush.sendNotification(subscription, payload);
        } catch (error: any) {
            console.error("Error sending notification:", error);
            // (Optional) Handle expired subscriptions
            if (error.statusCode === 410 || error.statusCode === 404) {
                console.log(`Deleting expired subscription: ${sub.id}`);
                await prisma.subscription.delete({
                    where: { id: sub.id }
                });
            }
        }
    });

    // await Promise.all(sendPromises);
    await Promise.allSettled(sendPromises);

    return NextResponse.json({ success: true });
}
