import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { Requester } from "../http";

type MessageEvent = {
  type: string;
  data: any;
  channel?: string;
};

type Listener = (event: MessageEvent["data"]) => void;

type SubscriptionInfo = {
  command: SubscribeCommand;
  controller: AbortController;
};

export class Subscriber extends EventTarget {
  private subscriptions: Map<string, SubscriptionInfo>;
  private client: Requester;
  private listeners: Map<string, Set<Listener>>;

  constructor(client: Requester, channels: string[]) {
    super();
    this.client = client;
    this.subscriptions = new Map();
    this.listeners = new Map();

    for (const channel of channels) {
      this.subscribeToChannel(channel);
    }
  }

  private subscribeToChannel(channel: string) {
    const controller = new AbortController();

    const command = new SubscribeCommand([channel], {
      streamOptions: {
        signal: controller.signal,
        onMessage: (data: string) => {
          // STREAM DATA PATTERN: data: message,channel1,{"msg":"Hello from channel 1!"}
          const messageData = data.replace(/^data:\s*/, "");
          const firstCommaIndex = messageData.indexOf(",");
          const secondCommaIndex = messageData.indexOf(",", firstCommaIndex + 1);

          if (firstCommaIndex !== -1 && secondCommaIndex !== -1) {
            const type = messageData.slice(0, firstCommaIndex);
            const channelName = messageData.slice(firstCommaIndex + 1, secondCommaIndex);
            const messageStr = messageData.slice(secondCommaIndex + 1);

            try {
              const message =
                type === "subscribe" ? Number.parseInt(messageStr) : JSON.parse(messageStr);

              // Dispatch to all relevant listeners
              this.dispatchToListeners(type, message);
              this.dispatchToListeners(`${type}Buffer`, { channel: channelName, message });
              this.dispatchToListeners(`${type}:${channelName}`, message);
            } catch (error) {
              this.dispatchToListeners("error", new Error(`Failed to parse message: ${error}`));
            }
          }
        },
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
    });
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
