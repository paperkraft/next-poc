import { NextResponse } from "next/server";
import { RECAPTCHA_SECRET_KEY } from "@/utils/constants";
import { signIn } from "@/auth";
import prisma from "@/lib/prisma";

const verifyCaptcha = async (captcha: string) => {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`, {
        method: 'POST',
    });

    const data = await response.json();

    if (!data.success) {
        return NextResponse.json({ success: false, message: 'Captcha verification failed' }, { status: 400 });
    }
    return data;
}

export async function POST(request: Request) {
    const { email, password, token } = await request.json();
    if (!token) {
        return NextResponse.json({ message: "Invalid Captcha" })
    } else {
        const verify = await verifyCaptcha(token);
        if (verify.success) {
            try {
                await signIn('credentials', { email, password, redirect: false });
                return NextResponse.json(
                    { success: true, message: 'Success' },
                    { status: 200 }
                );
            } catch (error: any) {
                return NextResponse.json({ ...error });
            }
        } else {
            return NextResponse.json({ success: false, message: 'Captcha verification failed' }, { status: 400 });
        }
    }
}

export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
            }
        });

        if (!users) {
            return NextResponse.json({ message: 'User doesnot exists' }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: users }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'Failed to update' }, { status: 500 });
    }
}