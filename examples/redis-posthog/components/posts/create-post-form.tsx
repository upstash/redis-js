"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PenLine, Clock } from "lucide-react";
import { useCreatePost } from "@/hooks/use-posts";
import { useSessionContext } from "@/hooks/use-session-context";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(5000),
});

type FormData = z.infer<typeof formSchema>;

export function CreatePostForm() {
  const { sessionId, tracker } = useSessionContext();
  const createPost = useCreatePost(sessionId);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createPost.mutate(
      { sessionId, title: data.title.trim(), content: data.content.trim() },
      {
        onSuccess: () => {
          form.reset();
          tracker.trackPostCreate();
        },
      }
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-200">
            <PenLine className="h-4 w-4 text-zinc-600" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800">Create a Post</h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>Auto-deletes after 1 hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-4">
        <div className="space-y-1.5">
          <Input
            placeholder="Give your post a title..."
            {...form.register("title")}
            disabled={createPost.isPending}
            maxLength={200}
            className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white focus:border-zinc-300 transition-colors"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Textarea
            placeholder="What's on your mind?"
            {...form.register("content")}
            className="min-h-[120px] resize-none bg-zinc-50 border-zinc-200 focus:bg-white focus:border-zinc-300 transition-colors"
            disabled={createPost.isPending}
            maxLength={5000}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-500">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        {createPost.isError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">
              {createPost.error?.message || "Failed to create post"}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={createPost.isPending || !form.formState.isValid}
            className="bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            {createPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
