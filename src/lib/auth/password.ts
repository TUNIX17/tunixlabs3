import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(input: string, hash: string): Promise<boolean> {
  return bcrypt.compare(input, hash);
}

// Compares input against ADMIN_PASSWORD env var using constant-time comparison.
// Both values are hashed to SHA-256 to ensure equal-length buffers and prevent
// timing leaks from length mismatch early returns.
export function verifyAdminPassword(input: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  try {
    const inputHash = crypto.createHash('sha256').update(input).digest();
    const expectedHash = crypto.createHash('sha256').update(adminPassword).digest();
    return crypto.timingSafeEqual(inputHash, expectedHash);
  } catch (error) {
    console.error('[Auth] Password verification error:', error);
    return false;
  }
}
