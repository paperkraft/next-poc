import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { RECAPTCHA_SECRET_KEY } from "@/utils/constant";

const verifyCaptcha = async (captcha:string) => {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`, {
        method: 'POST',
    });

    const data = await response.json();
    // console.log("captcha verify", data);
    if (!data.success) {
        return NextResponse.json({ success: false, message: 'Captcha verification failed' }, { status: 400 });
    }
    // return NextResponse.json({ success: true });
    return data;
}

export async function POST(request: Request) {
    const { email, password, token } = await request.json();

    // Verify captcha and get user info
    if(token !== null || token !== undefined){
        const verify = await verifyCaptcha(token);
        if(verify.success){
            /* GET User details */
            const user = await prisma.user.findUnique({
                where: { email: email },
            });
         
            if (!user || !(await bcrypt.compare(password, user.password as string))) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }
            return NextResponse.json({ id:user.id, name:user.name, email });
        }
    }
}
