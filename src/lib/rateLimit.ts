/**
 * In-memory rate limiter for API routes.
 * For production scale, replace with @upstash/ratelimit + Redis.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Cleanup old records every 5 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  check(key: string): { success: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = this.records.get(key);

    if (!record || now > record.resetAt) {
      this.records.set(key, { count: 1, resetAt: now + this.windowMs });
      return { success: true, remaining: this.maxRequests - 1, resetIn: this.windowMs };
    }

    if (record.count >= this.maxRequests) {
      return { success: false, remaining: 0, resetIn: record.resetAt - now };
    }

    record.count++;
    return {
      success: true,
      remaining: this.maxRequests - record.count,
      resetIn: record.resetAt - now,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.records.forEach((record, key) => {
      if (now > record.resetAt) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.records.delete(key));
  }
}

// Pre-configured limiters
/** 5 attempts per 15 minutes */
export const loginLimiter = new RateLimiter(5, 15 * 60 * 1000);
/** 60 requests per minute */
export const apiLimiter = new RateLimiter(60, 60 * 1000);
/** 20 requests per minute */
export const proxyLimiter = new RateLimiter(20, 60 * 1000);
/** 3 requests per 10 minutes */
export const contactLimiter = new RateLimiter(3, 10 * 60 * 1000);
/** 30 requests per minute */
export const captureLimiter = new RateLimiter(30, 60 * 1000);
/** 5 requests per minute */
export const exportLimiter = new RateLimiter(5, 60 * 1000);
