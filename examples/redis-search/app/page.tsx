"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const sections = [
    {
      title: "Create Index",
      description: "Learn how to create search indexes with different schemas and data types",
      href: "/create-index",
    },
    {
      title: "Basic Queries",
      description: "Master equality, regex, boolean, and numeric queries",
      href: "/query",
    },
    {
      title: "Advanced Queries",
      description: "Explore highlighting, field selection, boosting, and boolean logic",
      href: "/advanced-query",
    },
    {
      title: "Other Operations",
      description: "Manage indexes with describe and drop operations",
      href: "/other",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Redis Search Demo</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Interactive demonstration of Redis Search features with @upstash/redis
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/create-index">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://upstash.com/docs/redis/features/redisearch" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold mb-2">🚀 Quick Setup</h2>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>1. Create a <code className="px-1.5 py-0.5 rounded bg-background">.env.local</code> file with your Upstash Redis credentials</li>
          <li>2. Run <code className="px-1.5 py-0.5 rounded bg-background">pnpm run seed</code> to populate sample data</li>
          <li>3. Explore the interactive examples on each page</li>
        </ol>
      </div>
    </div>
  );
}
