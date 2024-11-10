// app/page.tsx
'use client';

import { useState } from 'react';

export default function BiometricRegister() {
  const [loading, setLoading] = useState(false);
  const [userId] = useState('66fbd413e2dde29f95a17879'); // Simulated user ID for demo

  const handleRegister = async () => {
    setLoading(true);

    // Fetch registration options from the server
    const response = await fetch('/api/webauthn/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const registrationOptions = await response.json();

    // Convert the response to the format WebAuthn expects
    const publicKeyCredentialCreationOptions = {
      challenge: new Uint8Array(registrationOptions.challenge),
      rp: {
        name: registrationOptions.rpName,
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: 'Test User',
        displayName:"Test User Display Name"
      },
      pubKeyCredParams: registrationOptions.pubKeyCredParams,
      timeout: registrationOptions.timeout,
    };

    try {
      // Prompt the user to authenticate with their biometric device
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      // Send the credential to the server for final registration
      const registerResponse = await fetch('/api/webauthn/register/finish', {
        method: 'POST',
        body: JSON.stringify({ credential }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await registerResponse.json();
      if (result.success) {
        alert('Registration successful!');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error during WebAuthn registration', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register Biometric Authentication'}
      </button>
    </div>
  );
}