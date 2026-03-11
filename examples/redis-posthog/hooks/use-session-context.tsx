"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventType, EventTypeValue } from "@/lib/schema";

const SESSION_STORAGE_KEY = "redis-posthog-session-id";

type Tracker = {
  trackPageView: () => void;
  trackPostCreate: () => void;
  trackPostView: () => void;
  trackPostLike: () => void;
  trackPostDelete: () => void;
  trackCommentCreate: () => void;
  trackCommentLike: () => void;
  trackCommentDelete: () => void;
};

type SessionContextValue = {
  sessionId: string;
  tracker: Tracker;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let existingSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!existingSessionId) {
      existingSessionId = uuidv4();
      sessionStorage.setItem(SESSION_STORAGE_KEY, existingSessionId);
    }
    setSessionId(existingSessionId);
  }, []);

  const track = async (eventType: EventTypeValue) => {
    if (!sessionId) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, eventType }),
    }).catch(console.error);
  };

  const tracker: Tracker = {
    trackPageView: () => track(EventType.PAGE_VIEW),
    trackPostCreate: () => track(EventType.POST_CREATE),
    trackPostView: () => track(EventType.POST_VIEW),
    trackPostLike: () => track(EventType.POST_LIKE),
    trackPostDelete: () => track(EventType.POST_DELETE),
    trackCommentCreate: () => track(EventType.COMMENT_CREATE),
    trackCommentLike: () => track(EventType.COMMENT_LIKE),
    trackCommentDelete: () => track(EventType.COMMENT_DELETE),
  };

  if (!sessionId) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ sessionId, tracker }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}
