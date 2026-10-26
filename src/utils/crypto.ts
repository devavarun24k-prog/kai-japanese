// src/utils/crypto.ts
// Cryptographic hashing and key derivation using standard Web Crypto API
// Zero third-party dependencies, browser and Node native

export async function hashPasswordWithSalt(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const saltBytes = hexToBytes(saltHex);
  const passwordBytes = enc.encode(password);

  // Combine salt + password
  const combined = new Uint8Array(saltBytes.length + passwordBytes.length);
  combined.set(saltBytes, 0);
  combined.set(passwordBytes, saltBytes.length);

  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export function generateRandomSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return bytesToHex(array);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Constant-time string comparison to prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
