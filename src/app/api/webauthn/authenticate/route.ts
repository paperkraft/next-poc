// app/api/webauthn/authenticate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server'; // Correct imports
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId;

    console.log(userId);
    

    // Retrieve the user from the database
    const userRecord = await prisma.user.findUnique({
      where: { id: userId},
      include: { credentials: true },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userCredential = userRecord.credentials[0];

    if (!userCredential) {
      return NextResponse.json({ error: 'User has no credentials for authentication' }, { status: 400 });
    }

    // Generate authentication options
    const authenticationOptions = await generateAuthenticationOptions({
      // timeout: 60000,  // 60 seconds timeout
      // challenge: userRecord.challenge as string,  // The stored challenge
      // rpID: 'localhost',  // Your app's domain (for production, replace this with your actual domain)
      // allowCredentials: [
      //   {
      //     id: new Uint8Array(userCredential.credentialID as any),  // Convert to Uint8Array for authentication
      //     type: 'public-key',
      //   },
      // ],

      userVerification:'preferred'
    });

    console.log('authenticationOptions', authenticationOptions);
    

    // Return authentication options to the client
    return NextResponse.json(authenticationOptions);
  } catch (error) {
    console.error('Error in authentication process:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
