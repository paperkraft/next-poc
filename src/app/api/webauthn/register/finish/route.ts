// app/api/webauthn/register/finish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

export async function POST(req: NextRequest) {

  const session = await auth();
  const user = session?.user

  try {
    const data = await req.json();
    const { credential, challenge } = data;

    // Retrieve the user from the database
    const userRecord = await prisma.user.findUnique({
      where: { email: user?.email },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Now verify the registration response

    const { verified, registrationInfo: info } =  await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
    });

    if (!verified || !info) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    // Save the credential info in the database
    await prisma.credential.create({
      data: {
        credentialID: isoBase64URL.fromBuffer(info.credentialID),
        publicKey: isoBase64URL.fromBuffer(info.credentialPublicKey),
        counter: info.counter,
        userId: userRecord.id,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error during registration verification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
