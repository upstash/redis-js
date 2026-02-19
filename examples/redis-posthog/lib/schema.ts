import { z } from "zod";

export const EventType = {
  PAGE_VIEW: "page_view",
  POST_CREATE: "post_create",
  POST_VIEW: "post_view",
  POST_LIKE: "post_like",
  POST_DELETE: "post_delete",
  COMMENT_CREATE: "comment_create",
  COMMENT_LIKE: "comment_like",
  COMMENT_DELETE: "comment_delete",
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

export type StoredEvent = {
  id: string;
  sessionId: string;
  eventType: EventTypeValue;
  timestamp: number;
};

export const eventPayloadSchema = z.object({
  sessionId: z.string(),
  eventType: z.enum(Object.values(EventType)),
});

export const eventSearchSchema = z.object({
  sessionId: z.string().optional(),
  eventTypes: z.string().optional(), // comma-separated list
  eventId: z.string().optional(),
  fromTimestamp: z.coerce.number().optional(),
  toTimestamp: z.coerce.number().optional(),
});

export const createPostSchema = z.object({
  sessionId: z.string(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
});

export const createCommentSchema = z.object({
  sessionId: z.string(),
  postId: z.string(),
  content: z.string().min(1).max(1000),
});

export const sessionActionSchema = z.object({
  sessionId: z.string(),
});

export type Comment = {
  id: string;
  sessionId: string;
  content: string;
  isLiked: boolean;
  createdAt: string;
};

export type Post = {
  id: string;
  sessionId: string;
  title: string;
  content: string;
  isLiked: boolean;
  comments: Comment[];
  createdAt: string;
};
