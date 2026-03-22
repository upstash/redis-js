"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Trash2,
  Loader2,
  User,
} from "lucide-react";
import { CommentForm } from "./comment-form";
import type { Post } from "@/lib/schema";
import { useDeletePost, useLikePost } from "@/hooks/use-posts";
import { useDeleteComment, useLikeComment } from "@/hooks/use-comments";
import { useSessionContext } from "@/hooks/use-session-context";

interface PostCardProps {
  post: Post;
}

function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(dateString).toLocaleDateString();
}

export function PostCard({ post }: PostCardProps) {
  const { sessionId, tracker } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [deletePostDialog, setDeletePostDialog] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const deletePost = useDeletePost(sessionId);
  const likePost = useLikePost(sessionId);
  const deleteComment = useDeleteComment(sessionId);
  const likeComment = useLikeComment(sessionId);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      tracker.trackPostView();
    }
  };

  const handleLikePost = () => {
    likePost.mutate(
      { postId: post.id, sessionId },
      { onSuccess: () => tracker.trackPostLike() }
    );
  };

  const handleDeletePost = () => {
    deletePost.mutate(
      { postId: post.id, sessionId },
      {
        onSuccess: () => {
          tracker.trackPostDelete();
          setDeletePostDialog(false);
        },
      }
    );
  };

  const handleLikeComment = (commentId: string) => {
    likeComment.mutate(
      { postId: post.id, commentId, sessionId },
      { onSuccess: () => tracker.trackCommentLike() }
    );
  };

  const handleDeleteComment = () => {
    if (!deleteCommentId) return;
    deleteComment.mutate(
      { postId: post.id, commentId: deleteCommentId, sessionId },
      {
        onSuccess: () => {
          tracker.trackCommentDelete();
          setDeleteCommentId(null);
        },
      }
    );
  };

  return (
    <>
      <div className="group rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all duration-200 overflow-hidden">
        {/* Post Header & Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 leading-tight">{post.title}</h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full ${
                  post.isLiked
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                    : "text-zinc-400 hover:text-red-500 hover:bg-red-50"
                }`}
                onClick={handleLikePost}
                disabled={likePost.isPending}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50"
                onClick={() => setDeletePostDialog(true)}
                disabled={deletePost.isPending}
              >
                {deletePost.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap pl-[52px]">
            {post.content}
          </p>

          {/* Like indicator (always visible when liked) */}
          {post.isLiked && (
            <div className="flex items-center gap-1.5 mt-3 pl-[52px]">
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              <span className="text-xs text-red-500 font-medium">Liked</span>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <Collapsible open={isOpen} onOpenChange={handleToggle}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-700">Comments</span>
                <Badge
                  variant="secondary"
                  className="bg-zinc-200/70 text-zinc-600 hover:bg-zinc-200/70"
                >
                  {post.comments.length}
                </Badge>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-zinc-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              )}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="border-t border-zinc-100 bg-zinc-50/30">
              {/* Comments List */}
              {post.comments.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No comments yet</p>
                  <p className="text-xs text-zinc-400 mt-1">Be the first to comment!</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="group/comment flex gap-3 p-3 rounded-xl bg-white border border-zinc-100 hover:border-zinc-200 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium">
                        <User className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                            {comment.isLiked && (
                              <>
                                <span className="mx-1">•</span>
                                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                              </>
                            )}
                          </div>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-7 w-7 rounded-full ${
                                comment.isLiked
                                  ? "text-red-500 hover:text-red-600"
                                  : "text-zinc-400 hover:text-red-500"
                              }`}
                              onClick={() => handleLikeComment(comment.id)}
                            >
                              <Heart className={`h-3.5 w-3.5 ${comment.isLiked ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full text-zinc-400 hover:text-red-500"
                              onClick={() => setDeleteCommentId(comment.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <div className="p-4 pt-0">
                <CommentForm postId={post.id} />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Delete Post Confirmation Dialog */}
      <ConfirmDialog
        open={deletePostDialog}
        onOpenChange={setDeletePostDialog}
        onConfirm={handleDeletePost}
        title="Delete Post"
        description="This will permanently delete this post and all its comments. This action cannot be undone."
        confirmText="Delete Post"
        variant="danger"
      />

      {/* Delete Comment Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteCommentId}
        onOpenChange={(open) => !open && setDeleteCommentId(null)}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        description="This will permanently delete this comment. This action cannot be undone."
        confirmText="Delete Comment"
        variant="danger"
      />
    </>
  );
}
