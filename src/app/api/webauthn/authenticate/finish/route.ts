// app/api/webauthn/authenticate/finish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

export async function POST(req: NextRequest) {

  try {
    const { credential, userId } = await req.json();

    // Retrieve the user from the database
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      include: { credentials: true },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the credential the user is using for authentication
    const userCredential = userRecord.credentials.find((passKey) => passKey.credentialID == credential.rawId);

    if (!userCredential) {
      return NextResponse.json({ error: 'User has no credentials for authentication' }, { status: 400 });
    }

    // Verify the authentication response from the client
    const { verified, authenticationInfo: info } = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: userRecord.challenge as string,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
      authenticator: {
        credentialID: isoBase64URL.toBuffer(userCredential.credentialID),
        credentialPublicKey: isoBase64URL.toBuffer(userCredential.publicKey),
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