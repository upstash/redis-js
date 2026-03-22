import { Redis, s } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const eventSchema = s.object({
  id: s.string().noTokenize(),
  sessionId: s.string().noTokenize(),
  eventType: s.string().noTokenize(),
  timestamp: s.number("U64"),
});

export const EVENTS_INDEX_NAME = "events-idx";
export const EVENTS_PREFIX = "event:";
export const POSTS_PREFIX = "post:";
export const COMMENTS_PREFIX = "comment:";
export const EVENT_TTL = 3600;
