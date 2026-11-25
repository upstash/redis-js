import type { H3Event } from "h3";

// Only callers with the admin token may change the cache
export function requireAdmin(event: H3Event) {
  const token = process.env.CACHE_ADMIN_TOKEN;
  if (!token || getHeader(event, "authorization") !== `Bearer ${token}`) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
}
