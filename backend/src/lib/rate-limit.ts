// A simple, zero-dependency in-memory rate limiter for API routes.
// WARNING: In a true production environment with serverless functions (like Vercel)
// or multiple instances, this in-memory map will reset between cold starts or
// across different server instances. For a student project or single-server
// deployment, it works perfectly to prevent basic spam.

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(identifier: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // If entry doesn't exist or has expired, create a new one
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true };
  }

  // If under limit, increment count
  if (entry.count < limit) {
    entry.count += 1;
    return { success: true };
  }

  // Rate limit exceeded
  return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}

// Utility to get the IP address from a request
export function getIp(req: { headers: { get(name: string): string | null } }): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return 'unknown-ip';
}
