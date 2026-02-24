import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Comment } from "@/lib/schema";
import { postKeys } from "./use-posts";

// API functions
async function createComment(payload: {
  postId: string;
  sessionId: string;
  content: string;
}): Promise<Comment> {
  const res = await fetch(`/api/posts/${payload.postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: payload.sessionId,
      content: payload.content,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create comment");
  }
  const data = await res.json();
  return data.comment;
}

async function deleteComment(payload: {
  postId: string;
  commentId: string;
  sessionId: string;
}): Promise<void> {
  const res = await fetch(
    `/api/posts/${payload.postId}/comments/${payload.commentId}?sessionId=${payload.sessionId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete comment");
}

async function likeComment(payload: {
  postId: string;
  commentId: string;
  sessionId: string;
}): Promise<{ isLiked: boolean }> {
  const res = await fetch(
    `/api/posts/${payload.postId}/comments/${payload.commentId}/like`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: payload.sessionId }),
    }
  );
  if (!res.ok) throw new Error("Failed to like comment");
  return res.json();
}

// Hooks
export function useCreateComment(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(sessionId) });
    },
  });
}

export function useDeleteComment(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(sessionId) });
    },
  });
}

export function useLikeComment(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list(sessionId) });
    },
  });
}
