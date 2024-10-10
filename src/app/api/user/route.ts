import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { captchaSecretKey } from "@/utils/constant";

const verifyCaptcha = async (captcha:string) => {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecretKey}&response=${captcha}`, {
        method: 'POST',
    });

    const data = await response.json();
    console.log("captcha verify", data);

    if (!data.success) {
        return NextResponse.json({ success: false, message: 'Captcha verification failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
    const { email, password, token } = await request.json();

    // Verify captcha value
    if(token !== null || token !== undefined){
        verifyCaptcha(token);
    }

   /* GET User details */
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password as string))) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ id:user.id, name:user.name, email });
   
}
