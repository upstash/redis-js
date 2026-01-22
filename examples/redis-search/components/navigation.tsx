"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/create-index", label: "Create Index" },
  { href: "/query", label: "Query" },
  { href: "/advanced-query", label: "Advanced Query" },
  { href: "/other", label: "Other Operations" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex h-14 items-center">
          <div className="mr-8 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Redis Search Demo</span>
            </Link>
          </div>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
