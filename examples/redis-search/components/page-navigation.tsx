"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PageNavigationProps {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}

export function PageNavigation({ prev, next }: PageNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t">
      <div>
        {prev ? (
          <Button asChild variant="outline">
            <Link href={prev.href}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {prev.label}
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
      <div>
        {next ? (
          <Button asChild>
            <Link href={next.href}>
              {next.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
