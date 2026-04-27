import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

const rateLimitMap = new LRUCache({
  max: 500,
  ttl: 1000 * 60, // 1 minute
});

export function rateLimit(req) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const limit = 30; // 30 requests per minute
  const now = Date.now();
  
  const current = rateLimitMap.get(ip) || [];
  const recentRequests = current.filter((timestamp) => now - timestamp < 60000);
  
  if (recentRequests.length >= limit) {
    return {
      isRateLimited: true,
      resetTime: recentRequests[0] + 60000,
    };
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return { isRateLimited: false };
}