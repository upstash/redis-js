"use client";

import { StepConfig } from "@/types/step";
import { QueryResult } from "@/components/query-result";
import { describeIndex, dropIndex } from "@/server/actions";
import { Badge } from "@/components/ui/badge";

export const otherSteps: StepConfig[] = [
  {
    title: "Describe Index",
    description: "Get detailed information about an index including its schema, data type, prefixes, and field configurations.",
    code: `const description = await index.describe();

// Returns:
// {
//   name: string;
//   dataType: "hash" | "string" | "json";
//   prefixes: string[];
//   language?: string;
//   schema: Record<string, DescribeFieldInfo>
// }`,
    result: (
      <QueryResult
        onQuery={describeIndex}
      />
    ),
  },
  {
    title: "Drop Index",
    description: (
      <>
        <p className="text-destructive font-semibold mb-2">⚠️ Warning: This will permanently delete the index!</p>
        <p>Use this to remove an index when you no longer need it. The indexed data in Redis will remain, but the search index will be gone.</p>
      </>
    ),
    code: `const result = await index.drop();

// Returns: 1 (success) or 0 (failed)`,
    result: (
      <div className="space-y-3">
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm text-destructive font-medium mb-2">
            ⚠️ Destructive Operation
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Dropping the index will delete it permanently. You&apos;ll need to re-run the seed script to recreate it.
          </p>
          <QueryResult
            onQuery={dropIndex}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          After dropping, run <code className="px-1 py-0.5 rounded bg-muted">npm run seed</code> or visit <code className="px-1 py-0.5 rounded bg-muted">/api/seed</code> to recreate the index.
        </p>
      </div>
    ),
  },
];
