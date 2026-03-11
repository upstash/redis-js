"use client";

import { Steps } from "@/components/steps";
import { querySteps } from "@/steps/query";
import { PageNavigation } from "@/components/page-navigation";

export default function QueryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Query Basics</h1>
        <p className="text-lg text-muted-foreground">
          Learn fundamental query operations including equality, regex, boolean, and numeric queries.
        </p>
      </div>
      
      <Steps steps={querySteps} />
      
      <PageNavigation
        prev={{ href: "/create-index", label: "Create Index" }}
        next={{ href: "/advanced-query", label: "Advanced Query" }}
      />
    </div>
  );
}
