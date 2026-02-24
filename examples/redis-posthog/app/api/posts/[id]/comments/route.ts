import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis, POSTS_PREFIX } from "@/lib/redis";
import { createCommentSchema, type Comment, type Post } from "@/lib/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json();

    const payload = { ...body, postId };

    const result = createCommentSchema.safeParse(payload);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.message },
        { status: 400 }
      );
    }

    const { sessionId, content } = result.data;

    const key = `${POSTS_PREFIX}${postId}`;
    const postData = await redis.json.get<Post[]>(key, "$");
    const post = postData?.[0];

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const comment: Comment = {
      id: uuidv4(),
      sessionId,
      content,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    await redis.json.arrappend(key, "$.comments", comment);

    return NextResponse.json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
