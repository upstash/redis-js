import { NextResponse } from "next/server";
import { redis, eventSchema, EVENTS_INDEX_NAME, EVENTS_PREFIX } from "@/lib/redis";

export async function GET() {
  const index = redis.search.index({
    name: EVENTS_INDEX_NAME,
    schema: eventSchema,
  });

  try {
    const info = await index.describe();

    if (!info.name) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      name: info.name,
      dataType: info.dataType,
      prefixes: info.prefixes,
    });
  } catch (err) {
    console.log("Index describe error (expected if not exists):", err);
    return NextResponse.json({ exists: false });
  }
}

export async function POST() {
  try {
    const idx = redis.search.index({
      name: EVENTS_INDEX_NAME,
      schema: eventSchema,
    });
    try {
      const info = await idx.describe();
      if (info.name) {
        return NextResponse.json(
          { error: "Index already exists" },
          { status: 409 }
        );
      }
    } catch (err) {
      // index doesn't exist
    }

    await redis.search.createIndex({
      name: EVENTS_INDEX_NAME,
      schema: eventSchema,
      dataType: "json",
      prefix: EVENTS_PREFIX,
      language: "english",
    });


    return NextResponse.json({
      success: true,
      message: "Index created successfully",
      name: EVENTS_INDEX_NAME,
    });

  } catch (error) {
    console.error("Error creating index:", error);
    return NextResponse.json(
      { error: `Failed to create index: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
