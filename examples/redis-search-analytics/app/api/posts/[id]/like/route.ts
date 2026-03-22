import { NextRequest, NextResponse } from "next/server";
import { redis, POSTS_PREFIX} from "@/lib/redis";
import { sessionActionSchema, type Post } from "@/lib/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await request.json();

    const result = sessionActionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.message},
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

    const isLiked = !post.isLiked;

    await redis.json.set(key, "$.isLiked", isLiked);

    return NextResponse.json({
      success: true,
      isLiked,
    });
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return NextResponse.json(
      { error: "Failed to like/unlike post" },
      { status: 500 }
    );
  }
}

