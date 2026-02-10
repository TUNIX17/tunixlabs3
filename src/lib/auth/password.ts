import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(input: string, hash: string): Promise<boolean> {
  return bcrypt.compare(input, hash);
}

// For the initial simple auth (ADMIN_PASSWORD env var is plaintext for now)
// This compares against the env var directly but uses timing-safe comparison
export function verifyAdminPassword(input: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  if (input.length !== adminPassword.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(input),
      Buffer.from(adminPassword)
    );
  } catch {
    return false;
  }
}
