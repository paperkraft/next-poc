'use server'
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { startRegistration } from "@simplewebauthn/browser";
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { RegistrationResponseJSON } from "@simplewebauthn/types";
import { NextResponse } from "next/server";

const RP_ID = "localhost";
const rpName = "Coding Tricks";
const CLIENT_URL = "http://localhost:3000";

export const getRegistrationOptions = async () => {

    const session = await auth();

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email }
    });

    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const options = await generateRegistrationOptions({
        rpID: RP_ID,
        rpName: rpName,
        userID: user.id,
        userName: user.name as string,
        timeout: 60000,
        attestationType: "none",
        authenticatorSelection: {
            userVerification: 'preferred',
        },
    });

    const challenge = options.challenge;

    await prisma.user.upsert({
        where: { email: user.email },
        update: { challenge },
        create: {
            id: user.id,
            email: user.email,
            challenge: challenge,
        },
    });

    return NextResponse.json(options);
}

export const registerDevice = async (registrationOptions: any, challenge: string) => {

    const session = await auth();

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email }
    });

    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const response = await startRegistration(registrationOptions);

    // Now verify the registration response
    const { verified, registrationInfo: info } = await verifyRegistrationResponse({
        response: response,
        expectedChallenge: challenge,
        expectedOrigin: CLIENT_URL,
        expectedRPID: RP_ID,
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
            userId: user.id,
        },
    });

    return NextResponse.json({ success: true });
}

export const getAuthenticationOptions = async (email: string) => {

    // Retrieve the user from the database
    const user = await prisma.user.findUnique({
        where: { email: email },
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
        userVerification: 'preferred'
    });

    if (authenticationOptions.rpId) {
        return NextResponse.json(authenticationOptions);
        // return NextResponse.json({ data: { option: authenticationOptions, userId: user.id } });
    }

    return NextResponse.json({ error: 'Error in authentication process' }, { status: 500 });
}

export const verifyAuthResponse = async (data: any) => {
    const { option, userId } = data;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { credentials: true },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the credential the user is using for authentication
    const userCredential = user.credentials.find((passKey) => passKey.credentialID == option.rawId);

    if (!userCredential) {
        return NextResponse.json({ error: 'User has no credentials for authentication' }, { status: 400 });
    }

    // Verify the authentication response from the client
    const { verified, authenticationInfo: info } = await verifyAuthenticationResponse({
        response: option,
        expectedChallenge: user.challenge as string,
        expectedOrigin: CLIENT_URL,
        expectedRPID: RP_ID,
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

}