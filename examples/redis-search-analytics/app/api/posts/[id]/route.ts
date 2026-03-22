import { NextRequest, NextResponse } from "next/server";
import { redis, POSTS_PREFIX } from "@/lib/redis";
import type { Post } from "@/lib/schema";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const sessionResult = z.string().safeParse(sessionId);
    if (!sessionResult.success) {
      return NextResponse.json(
        { error: "Invalid sessionId" },
        { status: 400 }
      );
    }

    const key = `${POSTS_PREFIX}${postId}`;
    const postData = await redis.json.get<Post[]>(key, "$");
    const post = postData?.[0];

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    await redis.del(key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

