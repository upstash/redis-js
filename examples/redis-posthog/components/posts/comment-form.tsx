"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useCreateComment } from "@/hooks/use-comments";
import { useSessionContext } from "@/hooks/use-session-context";

const formSchema = z.object({
  content: z.string().min(1, "Comment is required").max(1000),
});

type FormData = z.infer<typeof formSchema>;

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const { sessionId, tracker } = useSessionContext();
  const createComment = useCreateComment(sessionId);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: FormData) => {
    createComment.mutate(
      { postId, sessionId, content: data.content.trim() },
      {
        onSuccess: () => {
          form.reset();
          tracker.trackCommentCreate();
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
      <Textarea
        placeholder="Write a comment..."
        {...form.register("content")}
        className="min-h-[80px] pr-20 resize-none bg-white border-zinc-200 focus:border-zinc-300 rounded-xl text-sm"
        disabled={createComment.isPending}
      />
      <Button
        type="submit"
        size="sm"
        disabled={createComment.isPending || !form.formState.isValid}
        className="absolute bottom-3 right-3 h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg"
      >
        {createComment.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Send
          </>
        )}
      </Button>
    </form>
  );
}
