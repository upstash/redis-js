import { NextRequest, NextResponse } from "next/server";
import { redis, POSTS_PREFIX } from "@/lib/redis";
import { sessionActionSchema, type Post } from "@/lib/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: postId, commentId } = await params;
    const body = await request.json();

    const result = sessionActionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.message },
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

    const isLiked = !post.comments[commentIndex].isLiked;
    const updatedComments = post.comments.map((c) =>
      c.id === commentId ? { ...c, isLiked } : c
    );
    
    await redis.json.set(key, "$.comments", updatedComments);

    return NextResponse.json({
      success: true,
      isLiked,
    });
  } catch (error) {
    console.error("Error liking/unliking comment:", error);
    return NextResponse.json(
      { error: "Failed to like/unlike comment" },
      { status: 500 }
    );
  }
}

