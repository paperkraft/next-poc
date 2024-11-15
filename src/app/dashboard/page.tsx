"use client";
import DialogBox from "@/components/custom/dialog-box";
import TitlePage from "@/components/custom/page-heading";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  const mounted = useMounted();
  const { data: session } = useSession();
  const user = session?.user;

  console.log('session', session);

  useEffect(() => {
    if (mounted && user?.name === null) {
      setOpen(true);
    }
  }, [user, mounted]);

  const handleRegister = async () => {
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

      // Step 2: Call the WebAuthn API to create the credential
      const credential = await startRegistration(registrationOptions);

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
      // Step 1: Get authentication options from the server
      const response = await fetch("/api/webauthn/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email }),
      });

      const authenticationOptions = await response.json();

      // Step 2: Call the WebAuthn API to authenticate the user
      const credential = await startAuthentication(authenticationOptions);

      // Send the credential to the server for final authentication
      const loginResponse = await fetch("/api/webauthn/authenticate/finish", {
        method: "POST",
        body: JSON.stringify({ credential }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await loginResponse.json();

      if (result.success) {
        alert("Authentication successful!");
      } else {
        alert("Authentication failed");
      }
    } catch (error) {
      console.error("Error during WebAuthn authenticate", error);
    }
  };

  return (
    <>
      <TitlePage title="Dashboard" description="description" />
      <Button onClick={handleRegister} className="hidden">Generate Passkey</Button>
      <Button onClick={handleVerify} className="hidden">Verify Passkey</Button>
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
          <p>Welcome to Webdesk! It looks like your profile is incomplete. </p>
          <p>
            To enhance your experience, please complete your profile by visiting
            your profile settings..
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
  );
}