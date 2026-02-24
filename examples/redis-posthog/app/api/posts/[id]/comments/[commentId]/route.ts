import { NextRequest, NextResponse } from "next/server";
import { redis, POSTS_PREFIX } from "@/lib/redis";
import { type Post } from "@/lib/schema";
import { z } from "zod";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await params;
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

    const commentIndex = post.comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }
    
    const updatedComments = post.comments.filter((c) => c.id !== commentId);
    await redis.json.set(key, "$.comments", updatedComments);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

