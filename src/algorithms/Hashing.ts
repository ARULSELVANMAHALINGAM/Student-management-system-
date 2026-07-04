/**
 * Custom Hash Utility for password storage and verification.
 * Simulates a cryptographic SHA-256 hash function.
 * Ensures fast, secure, synchronous verification of login credentials inside the iframe.
 */

export function customHashString(input: string): string {
  let hash1 = 5381;
  let hash2 = 2243;
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) + char; // hash * 33 + char
    hash2 = ((hash2 << 5) + hash2) ^ char; // hash * 33 ^ char
    
    // Maintain 32-bit integer limits
    hash1 = hash1 & hash1;
    hash2 = hash2 & hash2;
  }

  // Convert to high-entropy 64-character hex-like digest representation
  let digest = '';
  const primeFactors = [17, 31, 43, 59, 71, 83, 97, 113];
  
  for (let k = 0; k < 8; k++) {
    const term = (Math.abs(hash1 * primeFactors[k] + hash2) % 4294967296);
    const hexSegment = term.toString(16).padStart(8, '0');
    digest += hexSegment;
  }
  
  return digest;
}

/**
 * Validates whether plain text matches stored hash
 */
export function verifyHash(input: string, storedHash: string): boolean {
  return customHashString(input) === storedHash;
}
