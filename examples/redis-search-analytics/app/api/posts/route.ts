import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis, POSTS_PREFIX, EVENT_TTL } from "@/lib/redis";
import { createPostSchema, type Post } from "@/lib/schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const result = z.string().safeParse(sessionId);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid sessionId" },
        { status: 400 }
      );
    }

    const keys = await redis.keys(`${POSTS_PREFIX}*`);
    if (keys.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    const posts: Post[] = [];
    for (const key of keys) {
      const postData = await redis.json.get<Post[]>(key, "$");
      const post = postData?.[0];
      if (post && post.sessionId === sessionId) {
        posts.push(post);
      }
    }

    return NextResponse.json({
      posts: posts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.error("Error listing posts:", error);
    return NextResponse.json(
      { error: "Failed to list posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = createPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { sessionId, title, content } = result.data;

    const postId = uuidv4();
    const key = `${POSTS_PREFIX}${postId}`;

    const post: Post = {
      id: postId,
      sessionId,
      title,
      content,
      isLiked: false,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    await redis.json.set(key, "$", post);
    await redis.expire(key, EVENT_TTL);

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
