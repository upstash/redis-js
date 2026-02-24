import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis, eventSchema, EVENTS_INDEX_NAME, EVENTS_PREFIX, EVENT_TTL } from "@/lib/redis";
import { eventPayloadSchema, eventSearchSchema, type StoredEvent } from "@/lib/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = eventPayloadSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { sessionId, eventType } = result.data;
    const eventId = uuidv4();
    const key = `${EVENTS_PREFIX}${eventId}`;

    const event: StoredEvent = {
      id: eventId,
      sessionId,
      eventType,
      timestamp: Date.now(),
    };

    await redis.json.set(key, "$", event);
    await redis.expire(key, EVENT_TTL);
    
    const index = redis.search.index({ name: EVENTS_INDEX_NAME });
    await index.waitIndexing();

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Error storing event:", error);
    return NextResponse.json({ error: "Failed to store event" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const result = eventSearchSchema.safeParse({
      sessionId: searchParams.get("sessionId") ?? undefined,
      eventTypes: searchParams.get("eventTypes") ?? undefined,
      eventId: searchParams.get("eventId") ?? undefined,
      fromTimestamp: searchParams.get("fromTimestamp") ?? undefined,
      toTimestamp: searchParams.get("toTimestamp") ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const { sessionId, eventTypes, eventId, fromTimestamp, toTimestamp } = result.data;

    const index = redis.search.index({
      name: EVENTS_INDEX_NAME,
      schema: eventSchema,
    });

    const conditions: Record<string, unknown>[] = [];

    if (sessionId) {
      conditions.push({ sessionId: { $eq: sessionId } });
    }

    if (eventId) {
      conditions.push({ id: { $eq: eventId } });
    }

    if (eventTypes) {
      const types = eventTypes.split(",").filter(Boolean);
      if (types.length === 1) {
        conditions.push({ eventType: { $eq: types[0] } });
      } else if (types.length > 1) {
        conditions.push({ eventType: { $in: types } });
      }
    }

    if (fromTimestamp) {
      conditions.push({ timestamp: { $gte: fromTimestamp } });
    }

    if (toTimestamp) {
      conditions.push({ timestamp: { $lte: toTimestamp } });
    }

    let filter: Record<string, unknown> = {};
    if (conditions.length === 1) {
      filter = conditions[0];
    } else if (conditions.length > 1) {
      filter = { $and: conditions };
    }

    const events = await index.query({
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      limit: 50,
    });

    const sortedEvents = events.sort((a, b) => b.data.timestamp - a.data.timestamp);

    return NextResponse.json({ events: sortedEvents });
  } catch (error) {
    console.error("Error querying events:", error);
    return NextResponse.json({ error: "Failed to query events" }, { status: 500 });
  }
}
