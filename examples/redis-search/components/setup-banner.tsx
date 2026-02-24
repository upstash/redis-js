"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SetupBanner() {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              First Time Setup
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>
                Before exploring the features, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Create a <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code> file with your Upstash Redis credentials</li>
                <li>Run <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">pnpm run seed</code> to create the index and add sample data</li>
              </ol>
              <p className="mt-2">
                See the <a href="/README.md" className="font-medium underline">README</a> for detailed instructions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
