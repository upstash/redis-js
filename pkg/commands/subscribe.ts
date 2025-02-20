import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { Requester } from "../http";
import { PSubscribeCommand } from "./psubscribe";

type MessageEvent = {
  type: string;
  data: any;
  channel?: string;
  pattern?: string;
};

type Listener = (event: MessageEvent["data"]) => void;

type SubscriptionInfo = {
  command: SubscribeCommand;
  controller: AbortController;
  isPattern: boolean;
};

export class Subscriber extends EventTarget {
  private subscriptions: Map<string, SubscriptionInfo>;
  private client: Requester;
  private listeners: Map<string, Set<Listener>>;

  constructor(client: Requester, channels: string[], isPattern: boolean = false) {
    super();
    this.client = client;
    this.subscriptions = new Map();
    this.listeners = new Map();

    for (const channel of channels) {
      if (isPattern) {
        this.subscribeToPattern(channel);
      } else {
        this.subscribeToChannel(channel);
      }
    }
  }

  private subscribeToChannel(channel: string) {
    const controller = new AbortController();

    const command = new SubscribeCommand([channel], {
      streamOptions: {
        signal: controller.signal,
        onMessage: (data: string) => this.handleMessage(data, false),
      },
    });

    command.exec(this.client).catch((error) => {
      if (error.name !== "AbortError") {
        this.dispatchToListeners("error", error);
      }
    });

    this.subscriptions.set(channel, {
      command,
      controller,
      isPattern: false,
    });
  }

  private subscribeToPattern(pattern: string) {
    const controller = new AbortController();

    const command = new PSubscribeCommand([pattern], {
      streamOptions: {
        signal: controller.signal,
        onMessage: (data: string) => this.handleMessage(data, true),
      },
    });

    command.exec(this.client).catch((error) => {
      if (error.name !== "AbortError") {
        this.dispatchToListeners("error", error);
      }
    });

    this.subscriptions.set(pattern, {
      command,
      controller,
      isPattern: true,
    });
  }

  private handleMessage(data: string, isPattern: boolean) {
    // Remove "data:" prefix and parse the message
    const messageData = data.replace(/^data:\s*/, "");
    const firstCommaIndex = messageData.indexOf(",");
    const secondCommaIndex = messageData.indexOf(",", firstCommaIndex + 1);
    const thirdCommaIndex = isPattern ? messageData.indexOf(",", secondCommaIndex + 1) : -1;

    if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
      const type = messageData.slice(0, firstCommaIndex);

      if (isPattern && type === "pmessage" && thirdCommaIndex !== -1) {
        // Handle pmessage format: pmessage,pattern,channel,message
        const pattern = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
        const channel = messageData.slice(secondCommaIndex + 1, thirdCommaIndex);
        const messageStr = messageData.slice(thirdCommaIndex + 1);

        try {
          const message = JSON.parse(messageStr);

          // Emit events for pattern messages
          this.dispatchToListeners("pmessage", message);
          this.dispatchToListeners(`pmessageBuffer`, { pattern, channel, message });
          this.dispatchToListeners(`pmessage:${pattern}`, { channel, message });
        } catch (error) {
          this.dispatchToListeners("error", new Error(`Failed to parse message: ${error}`));
        }
      } else {
        // Handle regular message format: message,channel,message
        const channel = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
        const messageStr = messageData.slice(secondCommaIndex + 1);

        try {
          const message =
            type === "subscribe" || type === "psubscribe"
              ? Number.parseInt(messageStr)
              : JSON.parse(messageStr);

          this.dispatchToListeners(type, message);
          this.dispatchToListeners(`${type}Buffer`, { channel, message });
          this.dispatchToListeners(`${type}:${channel}`, message);
        } catch (error) {
          this.dispatchToListeners("error", new Error(`Failed to parse message: ${error}`));
        }
      }
    }
  }

  private dispatchToListeners(type: string, data: any) {
    const listeners = this.listeners.get(type);
    if (listeners) {
      for (const listener of listeners) {
        listener(data);
      }
    }
  }

  on(type: string, listener: Listener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }

  async unsubscribe(channels?: string[]) {
    if (channels) {
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
      streamOptions: {
        isStreaming: true,
        onMessage: opts?.streamOptions?.onMessage,
        signal: opts?.streamOptions?.signal,
      },
    });
  }
}
