// app/api/webauthn/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {

  const data = await req.json();
  const id = data?.id
  const name = data?.name
  const email = data?.email


  if (!data?.email) {
    return NextResponse.json({ success: false, message: 'You are not connected.' }, { status: 401 });
  }

  try {

    const options = await generateRegistrationOptions({
      rpID: 'localhost',
      rpName: 'SV',
      userID: id,
      userName: name,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        userVerification: 'preferred',
      },
    });

    const challenge = options.challenge;

    await prisma.user.upsert({
      where: { email: email },
      update: { challenge },
      create: {
        id: id,
        email: email,
        challenge: challenge,
      },
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
