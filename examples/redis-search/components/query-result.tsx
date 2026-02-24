"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProductQueryResponseItem } from "@/lib/seed";
import { ProductCard } from "@/components/product-card";

export type QueryResponse =
  | {
      type: "error";
      error: string;
    }
  | {
      type: "message";
      message: string;
      count?: number;
    }
  | {
      type: "queryResponse";
      results: ProductQueryResponseItem[];
      highlighted?: boolean;
    }
  | {
      type: "count";
      count: number;
    }
  | {
      type: "indexStatus";
      exists: boolean;
      description?: {
        name: string;
        dataType: string;
        prefixes: string[];
        language?: string;
        schema: Record<string, unknown>;
      };
    };

interface QueryResultProps {
  onQuery: () => Promise<QueryResponse>;
}

function renderQueryResponse(response: QueryResponse): React.ReactNode {
  switch (response.type) {
    case "error":
      return (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          Error: {response.error}
        </div>
      );

    case "message":
      return (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            ✅ {response.message}
          </p>
          {response.count !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Total products: {response.count}
            </p>
          )}
        </div>
      );

    case "queryResponse":
      if (response.highlighted) {
        return (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Highlighted Results: {response.results.length}
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {response.results.map((item, idx) => (
                <div key={idx} className="rounded-lg border p-4 space-y-2">
                  <h3
                    className="font-semibold"
                    dangerouslySetInnerHTML={{ __html: item.data.name }}
                  />
                  <p
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: item.data.description }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium">
            Found {response.results.length} result{response.results.length !== 1 ? "s" : ""}
          </div>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {response.results.map((item, idx) => (
              <ProductCard key={idx} product={item} score={item.score} />
            ))}
          </div>
        </div>
      );

    case "count":
      return (
        <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-4">
          <div className="text-lg font-semibold">Total: {response.count}</div>
        </div>
      );

    case "indexStatus":
      return (
        <div
          className={`rounded-lg border p-4 ${
            response.exists
              ? "bg-green-500/10 border-green-500/20"
              : "bg-yellow-500/10 border-yellow-500/20"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              response.exists
                ? "text-green-600 dark:text-green-400"
                : "text-yellow-600 dark:text-yellow-400"
            }`}
          >
            {response.exists
              ? "✅ Index 'products-idx' exists and is ready to use!"
              : "⚠️ Index 'products-idx' does not exist yet. Create it first!"}
          </p>
          {response.exists && response.description && (
            <div className="mt-2 text-xs text-muted-foreground">
              Data type: {response.description.dataType} | Prefix:{" "}
              {response.description.prefixes.join(", ")}
            </div>
          )}
        </div>
      );
  }
}

export function QueryResult({ onQuery }: QueryResultProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResponse | null>(null);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const data = await onQuery();
      setResults(data);
    } catch (error) {
      setResults({
        type: "error",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleQuery} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Run Query
      </Button>

      {results && <div className="space-y-2">{renderQueryResponse(results)}</div>}
    </div>
  );
}
