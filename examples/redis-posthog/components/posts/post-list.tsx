"use client";

import { PostCard } from "./post-card";
import { CreatePostForm } from "./create-post-form";
import { Inbox } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useSessionContext } from "@/hooks/use-session-context";

export function PostList() {
  const { sessionId } = useSessionContext();
  const { data: posts = [], isLoading } = usePosts(sessionId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 rounded-full border-2 border-zinc-200 border-t-zinc-600 animate-spin mb-4" />
        <p className="text-sm text-zinc-500">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePostForm />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-800 mb-1">No posts yet</h3>
            <p className="text-sm text-zinc-500 text-center max-w-[280px]">
              Create your first post above to get started!
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
