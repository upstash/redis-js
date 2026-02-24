import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  // Disable in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed endpoint is disabled in production" },
      { status: 403 }
    );
  }

  const result = await seedDatabase();

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
