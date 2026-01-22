"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface SearchResultProps {
  onSearch: (term: string) => Promise<any>;
  renderResults: (results: any) => React.ReactNode;
  placeholder?: string;
}

export function SearchResult({
  onSearch,
  renderResults,
  placeholder = "Enter search term...",
}: SearchResultProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await onSearch(searchTerm);
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
