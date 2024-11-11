// app/api/webauthn/authenticate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import prisma from '@/lib/prisma';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

export async function POST(req: NextRequest) {
  try {
    const {email} = await req.json();

    // Retrieve the user from the database
    const user = await prisma.user.findUnique({
      where: { email: email},
      include: { credentials: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userCredential = user.credentials[0];

    if (!userCredential) {
      return NextResponse.json({ error: 'User has no credentials for authentication' }, { status: 400 });
    }

    // Generate authentication options
    const authenticationOptions = await generateAuthenticationOptions({
      challenge: isoBase64URL.toBuffer(user.challenge as string),
      userVerification:'preferred'
    });

    // Return authentication options to the client
    return NextResponse.json(authenticationOptions);
  } catch (error) {
    console.error('Error in authentication process:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}