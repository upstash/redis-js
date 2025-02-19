import { EventEmitter } from "node:stream";
import type { CommandOptions } from "./command";
import { Command } from "./command";
import { Requester } from "../http";

// eslint-disable-next-line unicorn/prefer-event-target
export class Subscriber extends EventEmitter {
  private subscription: SubscribeCommand;
  private abortController: AbortController;
  private channels: string[];

  constructor(client: Requester, channels: string[]) {
    super();
    this.channels = channels;
    this.abortController = new AbortController();
    this.subscription = new SubscribeCommand(channels, {
      signal: this.abortController.signal,
      onMessage: (data: string) => {
        console.log(data);
        // Remove "data:" prefix and parse the message
        const messageData = data.replace(/^data:\s*/, "");

        // Find the first two commas
        const firstCommaIndex = messageData.indexOf(",");
        const secondCommaIndex = messageData.indexOf(",", firstCommaIndex + 1);

        if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
          const type = messageData.slice(0, firstCommaIndex);
          const channel = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
          const messageStr = messageData.slice(secondCommaIndex + 1);

          try {
            const message =
              type === "subscribe" ? Number.parseInt(messageStr) : JSON.parse(messageStr);
            console.log("TYPE:", type, "| CHANNEL:", channel, "| MESSAGE:", message);
            this.emit(type, message);
            this.emit(`${type}Buffer`, { channel, message });
            this.emit(`${type}:${channel}`, message);
          } catch (error) {
            this.emit("error", new Error(`Failed to parse message: ${error}`));
          }
        }
      },
    });

    this.subscription.exec(client).catch((error) => {
      if (error.name !== "AbortError") {
        this.emit("error", error);
      }
    });
  }

  async unsubscribe(channels?: string[]) {
    if (channels) {
      for (const channel of channels) {
        const index = this.channels.indexOf(channel);
        if (index > -1) {
          this.channels.splice(index, 1);
        }
      }

      if (this.channels.length > 0) {
        console.log("ABORTING!", this.channels);
        this.abortController.abort();
        this.abortController = new AbortController();

        return;
      }
    } else {
      this.abortController.abort();
      this.removeAllListeners();
      this.channels = [];
    }
  }
}

/**
 * @see https://redis.io/commands/subscribe
 */
export class SubscribeCommand extends Command<number, number> {
  constructor(
    cmd: [...channels: string[]],
    opts?: CommandOptions<number, number> & { signal?: AbortSignal }
  ) {
    const sseHeaders = {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    super([], {
      ...opts,
      headers: sseHeaders,
      path: ["subscribe", ...cmd],
      isStreaming: true,
      onMessage: opts?.onMessage,
    });
  }
}
