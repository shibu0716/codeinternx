interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitRecord>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.store = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public check(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    const record = this.store.get(ip);

    // If no record exists, or the record has expired
    if (!record || record.resetTime < now) {
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1, reset: now + this.windowMs };
    }

    // If record exists and is within the window
    if (record.count >= this.maxRequests) {
      return { success: false, limit: this.maxRequests, remaining: 0, reset: record.resetTime };
    }

    // Increment count
    record.count += 1;
    this.store.set(ip, record);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  // Optional: Clean up expired records occasionally to prevent memory leaks in long-running processes
  public cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key);
      }
    }
  }
}
