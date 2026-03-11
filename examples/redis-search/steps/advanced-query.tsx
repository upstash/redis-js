"use client";

import { StepConfig } from "@/types/step";
import { SearchResult } from "@/components/search-result";
import { QueryResult } from "@/components/query-result";
import { queryProducts, queryProductsWithOptions } from "@/server/actions";

export const advancedQuerySteps: StepConfig[] = [
  {
    title: "Filter Without $ (Complex Backend Matching)",
    description: (
      <>
        When you omit the <code>$eq</code> and directly assign a value to a field,
        Redis Search performs a smart match in the backend that finds the best possible matches.
        This is useful for fuzzy text searching.
      </>
    ),
    code: `// Shorthand triggers complex filter
const results = await index.query({
  filter: { name: "laptop" }  // Smart match
});

// Compare with explicit $eq
const results = await index.query({
  filter: { name: { $eq: "laptop" } }  // Exact word match
});`,
    result: (
      <div className="space-y-4">
        <SearchResult
          placeholder="Try: laptop, mouse, gaming..."
          onSearch={async (term) => queryProducts({ name: term })}

        />
      </div>
    ),
  },
  {
    title: "Highlighting Matched Terms",
    description: (
      <>
        Use the <code>highlight</code> option to highlight matching terms in the results.
        Customize the tags used to wrap highlighted content.
      </>
    ),
    code: `// Basic highlighting
const results = await index.query({
  filter: { description: { $eq: "laptop" } },
  highlight: {
    fields: ["description", "name"]
  }
});

// Custom highlight tags
const results = await index.query({
  filter: { description: { $eq: "wireless" } },
  highlight: {
    fields: ["description"],
    preTag: "<mark>",
    postTag: "</mark>"
  }
});`,
    result: (
      <SearchResult
        placeholder="Enter term to highlight (e.g., wireless, gaming)"
        onSearch={async (term) =>
          queryProductsWithOptions(
            { description: { $eq: term } },
            {
              highlight: {
                fields: ["description", "name"],
                preTag: "<mark class='bg-yellow-200 dark:bg-yellow-800 px-1 rounded'>",
                postTag: "</mark>",
              },
            }
          )
        }
      />
    ),
  },
  {
    title: "Field Selection",
    description: (
      <>
        Use <code>select</code> to return only specific fields. This reduces payload size and improves performance.
        Use an empty object to return only keys and scores.
      </>
    ),
    code: `// Return specific fields only
const results = await index.query({
  filter: { category: "laptops" },
  select: { name: true, price: true }
});

// Return no data (keys and scores only)
const results = await index.query({
  filter: { active: true },
  select: {}
});

// Return nested fields
const results = await index.query({
  filter: { active: true },
  select: { name: true, "metadata.brand": true }
});`,
    result: (
      <QueryResult
        onQuery={async () =>
          queryProductsWithOptions(
            { category: { $eq: "laptops" } },
            { select: { name: true, price: true, category: true } }
          )
        }
      />
    ),
  },
  {
    title: "Boosting by Field",
    description: (
      <>
        Use <code>$boost</code> to increase relevance scores for specific conditions.
        Higher boost values give more weight to matching documents.
      </>
    ),
    code: `// Boost specific category
const results = await index.query({
  filter: {
    $should: [
      { category: { $eq: "laptops", $boost: 2.0 } },
      { category: { $eq: "accessories", $boost: 1.0 } }
    ]
  }
});

// Boost premium products
const results = await index.query({
  filter: {
    active: true,
    price: { $gt: 1000, $boost: 1.5 }
  }
});`,
    result: (
      <QueryResult
        onQuery={async () =>
          queryProducts({
            $should: [
              { category: { $eq: "laptops", $boost: 2.0 } },
              { category: { $eq: "accessories", $boost: 0.5 } },
            ],
          })
        }
      />
    ),
  },
  {
    title: "AND Operator",
    description: (
      <>
        Use <code>$and</code> or implicit AND by mixing fields at the root level.
        All conditions must match for a document to be returned.
      </>
    ),
    code: `// Explicit $and
const results = await index.query({
  filter: {
    $and: [
      { category: { $eq: "laptops" } },
      { price: { $gt: 1500 } }
    ]
  }
});

// Implicit AND (mixing fields)
const results = await index.query({
  filter: {
    category: { $eq: "laptops" },
    price: { $gt: 1500 },
    active: true
  }
});`,
    result: (
      <QueryResult
        onQuery={async () =>
          queryProducts({
            category: { $eq: "laptops" },
            price: { $gte: 1500 },
            active: true,
          })
        }
      />
    ),
  },
  {
    title: "OR Operator",
    description: (
      <>
        Use <code>$or</code> when at least one condition should match.
        Documents matching any of the conditions will be returned.
      </>
    ),
    code: `// Match either condition
const results = await index.query({
  filter: {
    $or: [
      { category: { $eq: "laptops" } },
      { category: { $eq: "monitors" } }
    ]
  }
});

// Complex OR
const results = await index.query({
  filter: {
    $or: [
      { price: { $lt: 50 } },
      { stock: { $gt: 150 } }
    ]
  }
});`,
    result: (
      <QueryResult
        onQuery={async () =>
          queryProducts({
            $or: [
              { category: { $eq: "laptops" } },
              { category: { $eq: "monitors" } },
            ],
          })
        }
      />
    ),
  },
  {
    title: "Complex Boolean Queries ($must + $should + $mustNot)",
    description: (
      <>
        Combine <code>$must</code>, <code>$should</code>, and <code>$mustNot</code> for sophisticated filtering.
        $must conditions are required, $should boosts matching docs, and $mustNot excludes docs.
      </>
    ),
    code: `// Full boolean query
const results = await index.query({
  filter: {
    $must: [
      { active: { $eq: true } }
    ],
    $should: [
      { category: { $eq: "laptops", $boost: 2.0 } },
      { price: { $lt: 100 } }
    ],
    $mustNot: [
      { stock: { $eq: 0 } }
    ]
  }
});`,
    result: (
      <QueryResult
        onQuery={async () =>
          queryProducts({
            $must: [{ active: { $eq: true } }],
            $should: [
              { category: { $eq: "laptops", $boost: 2.0 } },
              { category: { $eq: "audio", $boost: 1.5 } },
            ],
            $mustNot: [{ stock: { $lt: 20 } }],
          })
        }
      />
    ),
  },
];
