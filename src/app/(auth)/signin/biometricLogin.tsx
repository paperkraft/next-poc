// app/login/page.tsx
'use client';

import { useState } from 'react';

export default function BiometricLogin() {
  const [loading, setLoading] = useState(false);
  const [userId] = useState('66fbd413e2dde29f95a17879');

  const handleLogin = async () => {
    setLoading(true);

    // Fetch authentication options from the server
    const response = await fetch('/api/webauthn/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    const authenticationOptions = await response.json();

    // Convert the response to the format WebAuthn expects
    const publicKeyCredentialRequestOptions = {
      challenge: new Uint8Array(authenticationOptions.challenge),
      timeout: authenticationOptions.timeout,
      rpID: authenticationOptions.rpID,
    };

    try {
      // Prompt the user to authenticate with their biometric device
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

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
      console.error('Error during WebAuthn authentication', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Authenticating...' : 'Login with Biometric Authentication'}
      </button>
    </div>
  );
}
