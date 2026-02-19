"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Clock, Trash2 } from "lucide-react";

export function InfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200 bg-amber-100/50">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
          </div>
          <span className="font-semibold text-amber-900">Demo Application</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-amber-600 hover:text-amber-800 hover:bg-amber-200"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm text-amber-800 leading-relaxed">
          This is a demonstration of PostHog-like analytics built with Upstash Redis Search. 
          Feel free to create posts, comments, and interact with the page.
        </p>

        {/* Warning */}
        <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-amber-100 border border-amber-200">
          <Trash2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              All data will be automatically deleted
            </p>
            <p className="text-xs text-amber-700 mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Posts, comments, and events expire after 1 hour
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
