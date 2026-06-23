import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limit for the public enrollment endpoint. CLAUDE.md §9.
 * No-ops (always allows) when Upstash env vars are unset so local dev / the
 * first deploy don't break.
 */

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const limiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "arshin:enroll",
    })
  : null;

/** Returns true if the request is allowed. */
export async function checkRateLimit(identifier: string): Promise<boolean> {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit(identifier);
    return success;
  } catch (err) {
    console.error("[rate-limit] error, allowing request:", err);
    return true;
  }
}
