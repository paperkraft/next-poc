import { sendNotification } from "@/app/action/notifications.action";
import { NextRequest, NextResponse } from "next/server";

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