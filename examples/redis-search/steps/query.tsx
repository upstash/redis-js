"use client";

import { StepConfig } from "@/types/step";
import { QueryResult } from "@/components/query-result";
import { SearchResult } from "@/components/search-result";
import { ProductCard } from "@/components/product-card";
import { queryProducts, countProducts } from "@/server/actions";

export const querySteps: StepConfig[] = [
  {
    title: "Equality Query ($eq)",
    description: (
      <>
        Use <code>$eq</code> for exact matching. For text fields, it finds documents containing the word.
        You can also use shorthand syntax by directly assigning the value.
      </>
    ),
    code: `// Explicit $eq
const results = await index.query({
  filter: { category: { $eq: "laptops" } }
});

// Shorthand (smart match in backend)
const results = await index.query({
  filter: { category: "laptops" }
});`,
    result: (
      <QueryResult
        onQuery={async () => queryProducts({ category: { $eq: "laptops" } })}
        renderResults={(data) => (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Found {data.results?.length || 0} laptops
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {data.results?.map((item: any, idx: number) => (
                <ProductCard key={idx} product={item.data} score={item.score} />
              ))}
            </div>
          </div>
        )}
      />
    ),
  },
  {
    title: "Regex Query ($regex)",
    description: (
      <>
        Use <code>$regex</code> for pattern matching in text fields.
        Supports standard regex patterns for flexible text searching.
      </>
    ),
    code: `// Match products starting with "Mac"
const results = await index.query({
  filter: { name: { $regex: "Mac.*" } }
});

// Match products containing "Pro"
const results = await index.query({
  filter: { name: { $regex: ".*Pro.*" } }
});`,
    result: (
      <SearchResult
        placeholder="Enter regex pattern (e.g., Mac.*)"
        onSearch={async (term) => queryProducts({ name: { $regex: term } })}
        renderResults={(data) => (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Found {data.results?.length || 0} matching products
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {data.results?.map((item: any, idx: number) => (
                <ProductCard key={idx} product={item.data} score={item.score} />
              ))}
            </div>
          </div>
        )}
      />
    ),
  },
  {
    title: "Boolean Query",
    description: (
      <>
        Query boolean fields using <code>$eq</code> or shorthand syntax.
        Filter products by active status or other boolean properties.
      </>
    ),
    code: `// Find active products (shorthand)
const results = await index.query({
  filter: { active: true }
});

// Find inactive products (explicit)
const results = await index.query({
  filter: { active: { $eq: false } }
});`,
    result: (
      <div className="space-y-4">
        <QueryResult
          onQuery={async () => queryProducts({ active: true })}
          renderResults={(data) => (
            <div className="space-y-3">
              <div className="text-sm font-medium text-green-600">
                Active Products: {data.results?.length || 0}
              </div>
              {data.results?.slice(0, 3).map((item: any, idx: number) => (
                <ProductCard key={idx} product={item.data} score={item.score} />
              ))}
            </div>
          )}
        />
      </div>
    ),
  },
  {
    title: "Number Query (Comparison Operators)",
    description: (
      <>
        Query numeric fields using comparison operators: <code>$gt</code>, <code>$gte</code>,{" "}
        <code>$lt</code>, <code>$lte</code>, <code>$eq</code>.
      </>
    ),
    code: `// Products priced between $100 and $500
const results = await index.query({
  filter: {
    price: {
      $gte: 100,
      $lte: 500
    }
  }
});

// Products with high stock
const results = await index.query({
  filter: { stock: { $gt: 100 } }
});`,
    result: (
      <QueryResult
        onQuery={async () =>
          queryProducts({
            price: { $gte: 100, $lte: 500 },
          })
        }
        renderResults={(data) => (
          <div className="space-y-3">
            <div className="text-sm font-medium">
              Products between $100-$500: {data.results?.length || 0}
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {data.results?.map((item: any, idx: number) => (
                <ProductCard key={idx} product={item.data} score={item.score} />
              ))}
            </div>
          </div>
        )}
      />
    ),
  },
  {
    title: "Count Query",
    description: (
      <>
        Use <code>count()</code> to get the number of matching documents without retrieving them.
        All filter operators work with count.
      </>
    ),
    code: `// Count products in a category
const result = await index.count({
  filter: { category: { $eq: "accessories" } }
});

console.log(\`Found \${result.count} accessories\`);

// Count with complex filter
const result = await index.count({
  filter: {
    active: true,
    price: { $lt: 100 }
  }
});`,
    result: (
      <div className="space-y-4">
        <QueryResult
          onQuery={async () => countProducts({ category: { $eq: "accessories" } })}
          renderResults={(data) => (
            <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-4">
              <div className="text-lg font-semibold">
                Total Accessories: {data.count}
              </div>
            </div>
          )}
        />
        <QueryResult
          onQuery={async () =>
            countProducts({
              active: true,
              price: { $lt: 100 },
            })
          }
          renderResults={(data) => (
            <div className="rounded-md bg-green-50 dark:bg-green-950 p-4">
              <div className="text-lg font-semibold">
                Active Products Under $100: {data.count}
              </div>
            </div>
          )}
        />
      </div>
    ),
  },
];
