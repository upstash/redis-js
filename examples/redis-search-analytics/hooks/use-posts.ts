import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/lib/schema";

// Query keys
export const postKeys = {
  all: ["posts"] as const,
  list: (sessionId: string) => [...postKeys.all, "list", sessionId] as const,
  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
};

// API functions
async function fetchPosts(sessionId: string): Promise<Post[]> {
  const res = await fetch(`/api/posts?sessionId=${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data = await res.json();
  return data.posts || [];
}

async function createPost(payload: { sessionId: string; title: string; content: string }): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create post");
  }
  const data = await res.json();
  return data.post;
}

async function deletePost(payload: { postId: string; sessionId: string }): Promise<void> {
  const res = await fetch(`/api/posts/${payload.postId}?sessionId=${payload.sessionId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete post");
}

async function likePost(payload: { postId: string; sessionId: string }): Promise<{ isLiked: boolean }> {
  const res = await fetch(`/api/posts/${payload.postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: payload.sessionId }),
  });
  if (!res.ok) throw new Error("Failed to like/unlike post");
  return res.json();
}

// Hooks
export function usePosts(sessionId: string) {
  return useQuery({
    queryKey: postKeys.list(sessionId),
    queryFn: () => fetchPosts(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreatePost(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(sessionId) });
    },
  });
}

export function useDeletePost(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(sessionId) });
    },
  });
}

export function useLikePost(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(sessionId) });
    },
  });
}
