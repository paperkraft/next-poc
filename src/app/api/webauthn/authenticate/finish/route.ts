// app/api/webauthn/authenticate/finish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user

  try {
    const data = await req.json();

    // Retrieve the user from the database
    const userRecord = await prisma.user.findUnique({
      where: { id: user?.id },
      include: { credentials: true },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the credential the user is using for authentication
    const userCredential = userRecord.credentials[0];  // You could have multiple credentials

    if (!userCredential) {
      return NextResponse.json({ error: 'User has no credentials for authentication' }, { status: 400 });
    }


    // Verify the authentication response from the client
    const { verified, authenticationInfo: info } = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge: userRecord.challenge as string,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID:'localhost',
      authenticator:{
        credentialID: new Uint8Array(userCredential.credentialID as any),
        credentialPublicKey: new Uint8Array(userCredential.publicKey as any),
        counter: userCredential.counter
      }
    })


    if (!verified || !info) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
    }

    await prisma.credential.update({
      where: { id: userCredential.id },
      data: { counter: info.newCounter },
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in authentication verification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
