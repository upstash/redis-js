import { EventEmitter } from "node:stream";
import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { Requester } from "../http";

type SubscriptionInfo = {
  command: SubscribeCommand;
  controller: AbortController;
};
// eslint-disable-next-line unicorn/prefer-event-target
export class Subscriber extends EventEmitter {
  private subscriptions: Map<string, SubscriptionInfo>;
  private client: Requester;

  constructor(client: Requester, channels: string[]) {
    super();
    // this.channels = channels;
    this.client = client;
    this.subscriptions = new Map();
    for (const channel of channels) {
      this.subscribeToChannel(channel);
    }
  }

  private subscribeToChannel(channel: string) {
    const controller = new AbortController();

    const command = new SubscribeCommand([channel], {
      signal: controller.signal,
      onMessage: (data: string) => {
        // Remove "data:" prefix and parse the message
        const messageData = data.replace(/^data:\s*/, "");

        // Find the first two commas
        const firstCommaIndex = messageData.indexOf(",");
        const secondCommaIndex = messageData.indexOf(",", firstCommaIndex + 1);

        if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
          const type = messageData.slice(0, firstCommaIndex);
          const channelName = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
          const messageStr = messageData.slice(secondCommaIndex + 1);

          try {
            const message =
              type === "subscribe" ? Number.parseInt(messageStr) : JSON.parse(messageStr);
            this.emit(type, message);
            this.emit(`${type}Buffer`, { channel: channelName, message });
            this.emit(`${type}:${channelName}`, message);
          } catch (error) {
            this.emit("error", new Error(`Failed to parse message: ${error}`));
          }
        }
      },
    });

    command.exec(this.client).catch((error) => {
      if (error.name !== "AbortError") {
        this.emit("error", error);
      }
    });

    this.subscriptions.set(channel, {
      command,
      controller,
    });
  }

  async unsubscribe(channels?: string[]) {
    if (channels) {
      // Unsubscribe from specific channels
      for (const channel of channels) {
        const subscription = this.subscriptions.get(channel);
        if (subscription) {
          try {
            subscription.controller.abort();
          } catch {
            // ignore
          }
          this.subscriptions.delete(channel);
        }
      }
    } else {
      // Unsubscribe from all channels
      for (const subscription of this.subscriptions.values()) {
        try {
          subscription.controller.abort();
        } catch {
          // ignore
        }
      }
      this.subscriptions.clear();
      this.removeAllListeners();
    }
  }

  getSubscribedChannels(): string[] {
    return [...this.subscriptions.keys()];
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
      signal: opts?.signal,
    });
  }
}
