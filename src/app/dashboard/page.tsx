"use client";
import DialogBox from "@/components/custom/dialog-box";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  const mounted = useMounted();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (mounted && user?.name === null) {
      setOpen(true);
    }
  }, [user, mounted]);

  const handleClick = async () => {
    try {
      // Step 1: Get registration options from the server

      const response = await fetch("/api/webauthn/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session?.user),
      });

      const registrationOptions = await response.json();
      const challenge = registrationOptions.challenge;
      const challengeBuffer = new Uint8Array(
        atob(registrationOptions.challenge)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      console.log("Registration Options:", registrationOptions);

      const publicKeyCredentialCreationOptions = {
        // challenge: new Uint8Array(challenge),
        challenge: challengeBuffer,
        rp: {
          id: registrationOptions.rp.id,
          name: registrationOptions.rp.name,
        },
        user: {
          id: new TextEncoder().encode(user?.id),
          name: user?.name ?? "Vishal",
          displayName: user?.name ?? "Vishal",
        },
        pubKeyCredParams: registrationOptions.pubKeyCredParams,
        timeout: registrationOptions.timeout,
        authenticatorSelection: registrationOptions.authenticatorSelection,
      };

      // Step 2: Call the WebAuthn API to create the credential

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      console.log("Credential:", credential);

      // Step 3: Send the credential along with the challenge back to the server
      const registerResponse = await fetch("/api/webauthn/register/finish", {
        method: "POST",
        body: JSON.stringify({ credential, challenge }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await registerResponse.json();

      if (result.success) {
        alert("Registration successful!");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error during WebAuthn registration", error);
    }
  };

  const handleVerify = async () => {
    try {
      const userId = user?.id;

      const response = await fetch("/api/webauthn/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const authenticationOptions = await response.json();
      console.log("authenticationOptions", authenticationOptions);

      // Convert the response to the format WebAuthn expects
      const publicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(authenticationOptions.challenge),
        timeout: authenticationOptions.timeout,
        rpID: authenticationOptions.rpID,
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      console.log("credential", credential);

      // Send the credential to the server for final authentication
      const loginResponse = await fetch('/api/webauthn/authenticate/finish', {
        method: 'POST',
        body: JSON.stringify({ credential }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await loginResponse.json();

      if (result.success) {
        alert('Authentication successful!');
      } else {
        alert('Authentication failed');
      }

    } catch (error) {
      console.error("Error during WebAuthn authenticate", error);
    }
  };

  return (
    mounted && (
      <>
        <TitlePage title="Dashboard" description="description" />
        <br />
        <Button onClick={handleClick}>Generate Passkey</Button>
        <br />
        <Button onClick={handleVerify}>Verify Passkey</Button>
        {open && (
          <DialogBox
            open={open}
            title={"Profile Incomplete"}
            hideClose
            preventClose
          >
            <p>
              {" "}
              Hi <b>{user?.email}</b>,
            </p>
            <p>
              Welcome to Webdesk! It looks like your profile is incomplete.{" "}
            </p>
            <p>
              To enhance your experience, please complete your profile by
              visiting your profile settings..
            </p>
            <br />
            <p>It only takes a few minutes!</p>
            <p>Your profile information helps us serve you better!</p>
            <br />
            <p>Thanks for joining us!</p>
            <div className="mt-4 flex gap-2">
              <Button asChild>
                <Link href={"/profile"}>Go to Profile Settings</Link>
              </Button>
            </div>
          </DialogBox>
        )}
      </>
    )
  );
}
