import { StepConfig } from "@/types/step";
import { QueryResult } from "@/components/query-result";
import { describeIndex } from "@/server/actions";
import { Badge } from "@/components/ui/badge";

export const otherOperationsSteps: StepConfig[] = [
  {
    title: "Describe Index",
    description: (
      <>
        Use <code>describe()</code> to get detailed information about an index including its schema,
        data type, prefixes, and language settings.
      </>
    ),
    code: `const description = await index.describe();

// Returns:
// {
//   name: string;
//   dataType: "hash" | "string" | "json";
//   prefixes: string[];
//   language?: string;
//   schema: Record<string, DescribeFieldInfo>
// }

console.log("Index:", description.name);
console.log("Data Type:", description.dataType);
console.log("Prefixes:", description.prefixes);
console.log("Fields:", Object.keys(description.schema));`,
    result: (
      <QueryResult
        onQuery={async () => describeIndex()}
        renderResults={(data) => (
          <div className="space-y-4">
            {data.notFound ? (
              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  ⚠️ Index &apos;products-idx&apos; does not exist. Create it first on the Create Index page!
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="font-semibold mb-2">Index Information</h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-sm font-medium">Name:</span>
                      <Badge>{data.description?.name}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm font-medium">Data Type:</span>
                      <Badge variant="secondary">{data.description?.dataType}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm font-medium">Prefixes:</span>
                      {data.description?.prefixes?.map((p: string, i: number) => (
                        <Badge key={i} variant="outline">{p}</Badge>
                      ))}
                    </div>
                    {data.description?.language && (
                      <div className="flex gap-2">
                        <span className="text-sm font-medium">Language:</span>
                        <Badge variant="outline">{data.description.language}</Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Schema Fields</h4>
                  <div className="rounded-lg border">
                    <pre className="p-4 text-sm overflow-x-auto">
                      {JSON.stringify(data.description?.schema, null, 2)}
                    </pre>
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
        Use <code>drop()</code> to delete an index. This removes the index structure but does not delete
        the underlying data. Returns 1 on success, 0 on failure.
        <br />
        <strong className="text-destructive">Warning: This is a destructive operation!</strong>
      </>
    ),
    code: `const result = await index.drop();

if (result === 1) {
  console.log("✅ Index dropped successfully");
} else {
  console.log("❌ Failed to drop index");
}

// Note: Data with the prefix is not deleted,
// only the search index is removed`,
    result: (
      <div className="space-y-3">
        <div className="rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>⚠️ Demo Mode:</strong> Drop functionality is disabled in this demo to preserve the index.
            In a real application, this would delete the search index (but not the data).
          </p>
        </div>
        
        <div className="rounded-lg border p-4 bg-muted/50">
          <h4 className="font-semibold mb-2">What happens when you drop an index:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>The search index structure is removed</li>
            <li>You can no longer query the data via search</li>
            <li>The underlying Redis data (e.g., product:1, product:2) remains intact</li>
            <li>You can recreate the index and it will re-index the existing data</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold mb-2">To actually drop an index:</h4>
          <pre className="text-sm bg-slate-950 text-slate-50 p-3 rounded mt-2">
{`const result = await index.drop();
console.log(result); // 1 = success, 0 = failed`}
          </pre>
        </div>
      </div>
    ),
  },
  {
    title: "Sorting Results",
    description: (
      <>
        Use <code>orderBy</code> to sort results by a field. Sorting requires numeric/boolean/date fields
        to have fast mode enabled (automatic for numbers).
      </>
    ),
    code: `// Sort by price ascending
const results = await index.query({
  filter: { active: true },
  orderBy: { price: "ASC" },
  limit: 10
});

// Sort by stock descending
const results = await index.query({
  filter: { category: "laptops" },
  orderBy: { stock: "DESC" }
});

// Note: Sorting requires fast mode
// Numeric fields have it automatically
// For bool/date: use .fast() in schema`,
  },
  {
    title: "Pagination",
    description: (
      <>
        Use <code>limit</code> and <code>offset</code> for pagination. This allows you to fetch
        large result sets in manageable chunks.
      </>
    ),
    code: `// Get first 10 results
const page1 = await index.query({
  filter: { active: true },
  limit: 10,
  offset: 0
});

// Get next 10 results
const page2 = await index.query({
  filter: { active: true },
  limit: 10,
  offset: 10
});

// Get results 20-30
const page3 = await index.query({
  filter: { active: true },
  limit: 10,
  offset: 20
});`,
  },
];
