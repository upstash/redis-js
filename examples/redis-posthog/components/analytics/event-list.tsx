"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, PenLine, Activity, Heart, Trash2, MessageSquare, Clock, Copy, Check } from "lucide-react";
import type { StoredEvent } from "@/lib/schema";
import { EventType } from "@/lib/schema";

interface EventListProps {
  events: Array<{ key: string; data: StoredEvent }>;
  isLoading: boolean;
}

const eventConfig: Record<
  string,
  { icon: React.ReactNode; label: string; bgColor: string; iconColor: string; dotColor: string }
> = {
  [EventType.PAGE_VIEW]: {
    icon: <Eye className="h-4 w-4" />,
    label: "Page View",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  [EventType.POST_CREATE]: {
    icon: <PenLine className="h-4 w-4" />,
    label: "Post Created",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  [EventType.POST_VIEW]: {
    icon: <Activity className="h-4 w-4" />,
    label: "Post Viewed",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    dotColor: "bg-purple-500",
  },
  [EventType.POST_LIKE]: {
    icon: <Heart className="h-4 w-4" />,
    label: "Post Liked",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    dotColor: "bg-pink-500",
  },
  [EventType.POST_DELETE]: {
    icon: <Trash2 className="h-4 w-4" />,
    label: "Post Deleted",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  [EventType.COMMENT_CREATE]: {
    icon: <MessageSquare className="h-4 w-4" />,
    label: "Comment Created",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    dotColor: "bg-green-500",
  },
  [EventType.COMMENT_LIKE]: {
    icon: <Heart className="h-4 w-4" />,
    label: "Comment Liked",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
    dotColor: "bg-rose-500",
  },
  [EventType.COMMENT_DELETE]: {
    icon: <Trash2 className="h-4 w-4" />,
    label: "Comment Deleted",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    dotColor: "bg-orange-500",
  },
};

function formatTime(timestamp: number): { relative: string; absolute: string } {
  const diff = Date.now() - timestamp;
  const date = new Date(timestamp);
  const absolute = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  if (diff < 60000) {
    return { relative: `${Math.floor(diff / 1000)}s ago`, absolute };
  }
  if (diff < 3600000) {
    return { relative: `${Math.floor(diff / 60000)}m ago`, absolute };
  }
  return { relative: absolute, absolute };
}

export function EventList({ events, isLoading }: EventListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-slate-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <Activity className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 mb-1">No events found</p>
        <p className="text-xs text-slate-500">Events will appear here as they occur</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-380px)]">
      <div className="p-4 space-y-2">
        {events.map((event, i) => {
          const { eventType, timestamp, id } = event.data || {};
          // Use event.data.id if available, otherwise extract from key (event:uuid format)
          const eventId = id || event.key?.replace(/^event:/, "") || "";
          const config = eventConfig[eventType] || {
            icon: <Activity className="h-4 w-4" />,
            label: eventType,
            bgColor: "bg-slate-50",
            iconColor: "text-slate-600",
            dotColor: "bg-slate-500",
          };
          const time = formatTime(timestamp);
          const isCopied = copiedId === eventId;

          return (
            <div
              key={event.key || i}
              className="group relative flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 hover:shadow-sm transition-all duration-200"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-200 group-hover:scale-125 transition-transform" />

              {/* Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bgColor}`}>
                <span className={config.iconColor}>{config.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
                  <span className="text-sm font-medium text-slate-800">{config.label}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span title={time.absolute}>{time.relative}</span>
                </div>
              </div>

              {/* Event ID with copy button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (eventId) copyToClipboard(eventId);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600 hover:!bg-slate-300 hover:!text-slate-800 transition-all"
                title={`Click to copy: ${eventId}`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>{eventId.slice(0, 8) || "..."}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
