"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Database,
  Loader2,
  X,
  Clock,
  Check,
  Filter,
  Zap,
  RefreshCw,
  Search,
} from "lucide-react";
import { EventList } from "./event-list";
import { EventType, EventTypeValue } from "@/lib/schema";

interface AnalyticsPanelProps {
  sessionId: string;
}

type EventFilters = {
  eventTypes: EventTypeValue[];
  eventId: string;
  fromTimestamp: string;
  toTimestamp: string;
};

const EVENT_TYPE_OPTIONS: { value: EventTypeValue; label: string; color: string }[] = [
  { value: EventType.PAGE_VIEW, label: "Page View", color: "bg-blue-500" },
  { value: EventType.POST_CREATE, label: "Post Create", color: "bg-emerald-500" },
  { value: EventType.POST_VIEW, label: "Post View", color: "bg-purple-500" },
  { value: EventType.POST_LIKE, label: "Post Like", color: "bg-pink-500" },
  { value: EventType.POST_DELETE, label: "Post Delete", color: "bg-red-500" },
  { value: EventType.COMMENT_CREATE, label: "Comment Create", color: "bg-green-500" },
  { value: EventType.COMMENT_LIKE, label: "Comment Like", color: "bg-rose-500" },
  { value: EventType.COMMENT_DELETE, label: "Comment Delete", color: "bg-orange-500" },
];

async function checkIndex() {
  const res = await fetch("/api/index");
  const data = await res.json();
  return data.exists === true && !!data.name;
}

async function createIndex() {
  const res = await fetch("/api/index", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create index");
  return res.json();
}

async function fetchEvents(sessionId: string, filters: EventFilters) {
  const params = new URLSearchParams({ sessionId });

  if (filters.eventTypes.length > 0) {
    params.set("eventTypes", filters.eventTypes.join(","));
  }
  if (filters.eventId.trim()) {
    params.set("eventId", filters.eventId.trim());
  }
  if (filters.fromTimestamp) {
    params.set("fromTimestamp", new Date(filters.fromTimestamp).getTime().toString());
  }
  if (filters.toTimestamp) {
    params.set("toTimestamp", new Date(filters.toTimestamp).getTime().toString());
  }

  const res = await fetch(`/api/events?${params}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export function AnalyticsPanel({ sessionId }: AnalyticsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({
    eventTypes: [],
    eventId: "",
    fromTimestamp: "",
    toTimestamp: "",
  });
  const queryClient = useQueryClient();

  const { data: indexExists, isLoading: checkingIndex } = useQuery({
    queryKey: ["index"],
    queryFn: checkIndex,
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: createIndex,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["index"] }),
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["events", sessionId, filters],
    queryFn: () => fetchEvents(sessionId, filters),
    enabled: !!sessionId && !!indexExists,
    refetchInterval: 5000,
    gcTime: 0,
  });

  const events = data?.events || [];
  const hasFilters = filters.eventTypes.length > 0 || filters.eventId || filters.fromTimestamp || filters.toTimestamp;

  const clearFilters = () => {
    setFilters({ eventTypes: [], eventId: "", fromTimestamp: "", toTimestamp: "" });
  };

  const toggleEventType = (eventType: EventTypeValue) => {
    setFilters((f) => ({
      ...f,
      eventTypes: f.eventTypes.includes(eventType)
        ? f.eventTypes.filter((t) => t !== eventType)
        : [...f.eventTypes, eventType],
    }));
  };

  return (
    <div
      className={`fixed right-0 top-0 z-40 flex h-full transition-all duration-300 ease-in-out ${
        isOpen ? "w-[420px]" : "w-12"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-12 flex-col items-center justify-center border-l bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <BarChart3 className="h-5 w-5" />
          {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="flex h-full flex-1 flex-col border-l bg-white shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Live Events</h2>
                  <p className="text-xs text-slate-400">Redis Search Analytics</p>
                </div>
              </div>
              {indexExists && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/10 text-white border-0 text-xs font-medium">
                    {events.length}
                    {events.length === 10 ? "+" : ""} events
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                    onClick={() => refetch()}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          {indexExists && (
            <div className="border-b bg-slate-50/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Filter className="h-4 w-4" />
                  Filters
                </div>
                {hasFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 px-2 text-xs text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Event Type Multi-Select */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Event Types
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10 bg-white border-slate-200 hover:bg-slate-50"
                    >
                      {filters.eventTypes.length === 0 ? (
                        <span className="text-slate-400">All event types</span>
                      ) : (
                        <span className="text-slate-700">{filters.eventTypes.length} selected</span>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-2" align="start">
                    <div className="space-y-0.5">
                      {EVENT_TYPE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleEventType(option.value)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 transition-colors"
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                              filters.eventTypes.includes(option.value)
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {filters.eventTypes.includes(option.value) && <Check className="h-3 w-3" />}
                          </div>
                          <div className={`h-2 w-2 rounded-full ${option.color}`} />
                          <span className="text-slate-700">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {filters.eventTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {filters.eventTypes.map((type) => {
                      const option = EVENT_TYPE_OPTIONS.find((o) => o.value === type);
                      return (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="pl-2 pr-1 py-1 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 cursor-pointer transition-colors"
                          onClick={() => toggleEventType(type)}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${option?.color}`} />
                          {type.replace(/_/g, " ")}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator className="!my-4" />

              {/* Event ID Search */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  Event ID
                </label>
                <Input
                  type="text"
                  placeholder="Paste event ID to search..."
                  value={filters.eventId}
                  onChange={(e) => setFilters((f) => ({ ...f, eventId: e.target.value }))}
                  className="h-9 text-sm bg-white border-slate-200 font-mono"
                />
              </div>

              <Separator className="!my-4" />

              {/* Time Range */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Time Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500">From</span>
                    <Input
                      type="datetime-local"
                      value={filters.fromTimestamp}
                      onChange={(e) => setFilters((f) => ({ ...f, fromTimestamp: e.target.value }))}
                      className="h-9 text-sm bg-white border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500">To</span>
                    <Input
                      type="datetime-local"
                      value={filters.toTimestamp}
                      onChange={(e) => setFilters((f) => ({ ...f, toTimestamp: e.target.value }))}
                      className="h-9 text-sm bg-white border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {checkingIndex ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Checking index...</p>
                </div>
              </div>
            ) : !indexExists ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">No Index Found</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-[280px]">
                  Create a Redis Search index to start tracking and querying events in real-time.
                </p>
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  Create Index
                </Button>
              </div>
            ) : (
              <EventList events={events} isLoading={isLoading} />
            )}
          </div>

          {/* Footer */}
          {indexExists && (
            <div className="border-t bg-slate-50 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Auto-refresh every 5s</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-600 font-medium">Live</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
