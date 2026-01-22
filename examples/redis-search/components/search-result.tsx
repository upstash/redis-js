"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { QueryResponse } from "@/components/query-result";
import { ProductCard } from "@/components/product-card";

interface SearchResultProps {
  onSearch: (term: string) => Promise<QueryResponse>;
  placeholder?: string;
}

function renderSearchResponse(
  response: QueryResponse
): React.ReactNode {
  switch (response.type) {
    case "error":
      return (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          Error: {response.error}
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

    default:
      return null;
  }
}

export function SearchResult({
  onSearch,
  placeholder = "Enter search term...",
}: SearchResultProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<QueryResponse | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await onSearch(searchTerm);
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
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Search
        </Button>
      </div>

      {results && <div className="space-y-2">{renderSearchResponse(results)}</div>}
    </div>
  );
}
