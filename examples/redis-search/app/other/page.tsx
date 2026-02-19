"use client";

import { Steps } from "@/components/steps";
import { otherSteps } from "@/steps/other";
import { PageNavigation } from "@/components/page-navigation";

export default function OtherPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Other Operations</h1>
        <p className="text-lg text-muted-foreground">
          Explore index management operations like describe and drop.
        </p>
      </div>

      <Steps steps={otherSteps} />
      
      <PageNavigation
        prev={{ href: "/advanced-query", label: "Advanced Query" }}
      />
    </div>
  );
}
