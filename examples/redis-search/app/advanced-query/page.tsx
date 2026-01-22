"use client";

import { Steps } from "@/components/steps";
import { advancedQuerySteps } from "@/steps/advanced-query";
import { PageNavigation } from "@/components/page-navigation";

export default function AdvancedQueryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Advanced Queries</h1>
        <p className="text-lg text-muted-foreground">
          Master advanced features like highlighting, field selection, boosting, and complex boolean logic.
        </p>
      </div>

      <Steps steps={advancedQuerySteps} />
      
      <PageNavigation
        prev={{ href: "/query", label: "Query" }}
        next={{ href: "/other", label: "Other Operations" }}
      />
    </div>
  );
}
