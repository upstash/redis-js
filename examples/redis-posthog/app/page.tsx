"use client";

import { useEffect } from "react";
import { InfoBanner } from "@/components/info-banner";
import { PostList } from "@/components/posts/post-list";
import { AnalyticsPanel } from "@/components/analytics/analytics-panel";
import { Activity } from "lucide-react";
import { useSessionContext } from "@/hooks/use-session-context";

export default function Home() {
  const { sessionId, tracker } = useSessionContext();

  useEffect(() => {
    tracker.trackPageView();
  }, [sessionId, tracker]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="pr-[420px]">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Redis Analytics Demo</h1>
                <p className="text-sm text-zinc-500">PostHog-like analytics on Upstash Redis Search</p>
              </div>
            </div>
          </header>

          {/* Info Banner */}
          <div className="mb-6">
            <InfoBanner />
          </div>

          {/* Session Card */}
          <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Your Session ID</span>
              <code className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-mono text-zinc-700 border border-zinc-200">
                {sessionId?.slice(0, 8)}...{sessionId?.slice(-4)}
              </code>
            </div>
          </div>

          {/* Posts */}
          <PostList />
        </div>
      </div>

      <AnalyticsPanel sessionId={sessionId} />
    </div>
  );
}
