"use client";

import { Steps } from "@/components/steps";
import { createIndexSteps } from "@/steps/create-index";
import { PageNavigation } from "@/components/page-navigation";

export default function CreateIndexPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Create Index</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to create search indexes with different schemas and data types.
        </p>
      </div>

      <Steps steps={createIndexSteps} />
      
      <PageNavigation
        prev={{ href: "/", label: "Home" }}
        next={{ href: "/query", label: "Query" }}
      />
    </div>
  );
}
