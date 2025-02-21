import { Command, type CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/psubscribe
 */
export class PSubscribeCommand extends Command<number, number> {
  constructor(cmd: [...patterns: string[]], opts?: CommandOptions<number, number>) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["psubscribe", ...cmd],
      streamOptions: {
        isStreaming: true,
        onMessage: opts?.streamOptions?.onMessage,
        signal: opts?.streamOptions?.signal,
      },
    });
  }
}
