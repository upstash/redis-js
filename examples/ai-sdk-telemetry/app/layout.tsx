import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI SDK Telemetry — Upstash Redis Search",
  description:
    "Live analytics for Vercel AI SDK generations and tool calls, served entirely by Upstash Redis Search aggregations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
