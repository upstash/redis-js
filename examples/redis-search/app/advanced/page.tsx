"use client";

import { Steps } from "@/components/steps";
import { advancedQuerySteps } from "@/steps/advanced-query";

export default function AdvancedPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Advanced Query</h1>
        <p className="text-lg text-muted-foreground">
          Explore advanced features like highlighting, field selection, boosting, and complex boolean queries.
        </p>
      </div>
      
      <Steps steps={advancedQuerySteps} />
    </div>
  );
}
