import { NextResponse } from "next/server";
import { RECAPTCHA_SECRET_KEY } from "@/utils/constant";
import { signIn } from "@/auth";

const verifyCaptcha = async (captcha:string) => {
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
    if(token === null || token === undefined){
        return NextResponse.json({ message:"Invalid Captcha" })
    } else {
        const verify = await verifyCaptcha(token);
        if(verify.success){
            try {
                await signIn('credentials', { email, password })
                return NextResponse.json({ message: 'Success' }, { status: 200 });
            } catch (error:any) {
                return NextResponse.json({...error});
            }
        } else {
            return NextResponse.json({ success: false, message: 'Captcha verification failed' }, { status: 400 });
        }
    }
}
