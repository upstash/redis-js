import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/subscribe
 */
export class SubscribeCommand extends Command<number, number> {
  private defaultMessageHandler(data: string) {
    if (data.startsWith("message,")) {
      // Find the index of first comma and second comma
      const firstComma = data.indexOf(",");
      const secondComma = data.indexOf(",", firstComma + 1);

      // Extract the channel and message parts
      const channel = data.slice(firstComma + 1, secondComma);
      const message = data.slice(Math.max(0, secondComma + 1));

      const parsedMessage = JSON.parse(message);
      console.log("message", channel, parsedMessage);
      return message;
    }
    return null;
  }

  constructor(cmd: [channel: string], opts?: CommandOptions<number, number>) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["subscribe", cmd[0]],
      isStreaming: true,
      onMessage: (data: string) => {
        const message = this.defaultMessageHandler(data);
        if (message && opts?.onMessage) {
          opts.onMessage(message);
        }
      },
    });
  }
}
