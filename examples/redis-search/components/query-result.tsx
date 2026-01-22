"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface QueryResultProps {
  onQuery: () => Promise<any>;
  renderResults: (results: any) => React.ReactNode;
}

export function QueryResult({ onQuery, renderResults }: QueryResultProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const data = await onQuery();
      setResults(data);
    } catch (error) {
      setResults({
        success: false,
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

      {results && (
        <div className="space-y-2">
          {results.success === false ? (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Error: {results.error}
            </div>
          ) : (
            renderResults(results)
          )}
        </div>
      )}
    </div>
  );
}
