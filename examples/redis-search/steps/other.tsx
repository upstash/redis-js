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
        renderResults={(data) => (
          <div className="space-y-3">
            {data.notFound ? (
              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  ⚠️ Index 'products-idx&apos; does not exist. Create it first on the Create Index page!
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Index Name:</span>
                    <Badge variant="outline">{data.description?.name}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Data Type:</span>
                    <Badge variant="outline">{data.description?.dataType}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Prefixes:</span>
                    {data.description?.prefixes?.map((prefix: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{prefix}</Badge>
                    ))}
                  </div>
                  {data.description?.language && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Language:</span>
                      <Badge variant="outline">{data.description.language}</Badge>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Schema Fields:</h4>
                  <div className="grid gap-2">
                    {data.description?.schema && Object.entries(data.description.schema).map(([field, info]: [string, any]) => (
                      <div key={field} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm">{field}</span>
                          <Badge variant="secondary" className="text-xs">
                            {info.type}
                          </Badge>
                        </div>
                        {info.options && Object.keys(info.options).length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {Object.entries(info.options).map(([key, value]) => (
                              value && <Badge key={key} variant="outline" className="text-xs">{key}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
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
            Dropping the index will delete it permanently. You'll need to re-run the seed script to recreate it.
          </p>
          <QueryResult
            onQuery={dropIndex}
            renderResults={(data) => (
              <div className="rounded-lg bg-card border p-3">
                {data.result === 1 ? (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✅ Index dropped successfully!
                  </p>
                ) : (
                  <p className="text-sm text-destructive">
                    ❌ Failed to drop index (it may not exist)
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          After dropping, run <code className="px-1 py-0.5 rounded bg-muted">npm run seed</code> or visit <code className="px-1 py-0.5 rounded bg-muted">/api/seed</code> to recreate the index.
        </p>
      </div>
    ),
  },
];
