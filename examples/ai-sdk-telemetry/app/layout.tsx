import type { Metadata } from "next";
import "./globals.css";
import { createTelemetryIndex } from "@/src/index-setup";

export const metadata: Metadata = {
  title: "AI SDK Telemetry — Upstash Redis Search",
  description:
    "Live analytics for Vercel AI SDK generations and tool calls, served entirely by Upstash Redis Search aggregations.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Guarantee the index exists before the dashboard renders. `existsOk: true`
  // makes this a safe no-op once it's been created, so every page load lands on
  // a ready index — no separate setup step required.
  await createTelemetryIndex();

  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
