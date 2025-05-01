import { sendNotification } from "@/app/action/notifications.action";
import prisma from "@/lib/prisma";
import { sendWebPushNotification } from "@/lib/web-push";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     const { title, message, topics, userId } = await req.json();

//     if (!title || !message || (!topics && !userId)) {
//         return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     try {

//         // Fetch subscriptions based on target type
//         let subscriptions: any = [];

//         // Fetch all subscriptions subscribed to the topic
//         if (topics) {
//             subscriptions = await prisma.subscription.findMany({
//                 where: {
//                     topics: {
//                         hasSome: topics
//                     }
//                 }
//             });
//         } else if (userId) {
//             subscriptions = await prisma.subscription.findMany({
//                 where: {
//                     userId,
//                 },
//             });
//         }

//         if (subscriptions.length === 0) {
//             return NextResponse.json({ success: false, message: "No subscriptions found" });
//         }

//         const sendPromises = subscriptions?.map(async (sub: any) => {
//             try {
//                 await sendWebPushNotification({
//                     subscription: sub.subscription,
//                     title,
//                     body: message,
//                 });
//             } catch (error: any) {
//                 console.error("Error sending notification:", error);

//                 // (Optional) Handle expired subscriptions
//                 if (error.statusCode === 410 || error.statusCode === 404) {
//                     console.log(`Deleting expired subscription: ${sub.id}`);
//                     await prisma.subscription.delete({
//                         where: { id: sub.id }
//                     });
//                 }
//             }
//         });

//         await Promise.all(sendPromises);
//         // await Promise.allSettled(sendPromises);
//         return NextResponse.json({ success: true, message: `Notification sent to ${subscriptions.length} subscription(s)` });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, message: `Error in sending notiifications` });
//     }

// }

export async function POST(req: NextRequest) {
    const { title, message, topics, userId } = await req.json();

    if (!title || !message || (!topics && !userId)) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data = {
        topics: topics ?? undefined,
        userId: userId ?? undefined,
        title,
        message,
    }

    try {
        await sendNotification(data);
        return NextResponse.json({ success: true, message: `Notification sent successfully` });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: `Error in sending notiifications` });
    }

}