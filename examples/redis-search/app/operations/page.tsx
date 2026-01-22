"use client";

import { Steps } from "@/components/steps";
import { otherOperationsSteps } from "@/steps/other-operations";

export default function OperationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Other Operations</h1>
        <p className="text-lg text-muted-foreground">
          Learn about index management operations like describe, drop, sorting, and pagination.
        </p>
      </div>
      
      <Steps steps={otherOperationsSteps} />
    </div>
  );
}
