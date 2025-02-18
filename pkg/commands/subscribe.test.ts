import { expect, test, describe } from "bun:test";
import { newHttpClient } from "../test-utils";
import { SubscribeCommand } from "./subscribe";
import { PublishCommand } from "./publish";

describe("Subscribe Command", () => {
  const client = newHttpClient();

  test("receives a single published message", async () => {
    const channel = "test-single";
    const receivedMessages: any[] = [];

    const subscription = new SubscribeCommand([channel], {
      onMessage: (message) => {
        receivedMessages.push(JSON.parse(message));
      },
    });

    const subscribePromise = subscription.exec(client);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const testMessage = {
      user: "testUser",
      message: "Hello, World!",
      timestamp: Date.now(),
    };

    await new PublishCommand([channel, JSON.stringify(testMessage)]).exec(client);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await subscribePromise;
    expect(result).toBe(1);
    expect(receivedMessages).toHaveLength(1);
    expect(receivedMessages[0]).toEqual(testMessage);
  }, 10000);

  test("receives multiple messages in order", async () => {
    const channel = "test-multiple";
    const receivedMessages: any[] = [];

    const subscription = new SubscribeCommand([channel], {
      onMessage: (message) => {
        receivedMessages.push(JSON.parse(message));
      },
    });

    const subscribePromise = subscription.exec(client);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const messages = [
      { user: "user1", message: "First", timestamp: Date.now() },
      { user: "user1", message: "Second", timestamp: Date.now() + 1 },
      { user: "user1", message: "Third", timestamp: Date.now() + 2 },
    ];

    for (const msg of messages) {
      await new PublishCommand([channel, JSON.stringify(msg)]).exec(client);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await subscribePromise;

    expect(receivedMessages).toHaveLength(messages.length);
    expect(receivedMessages.map((m) => m.message)).toEqual(messages.map((m) => m.message));
  }, 15000);

  test("uses default message handler when no handler provided", async () => {
    const channel = "test-default";
    const logs: any[] = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args);

    try {
      const subscription = new SubscribeCommand([channel]);
      const subscribePromise = subscription.exec(client);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const testMessage = {
        user: "testUser",
        message: "Test default",
        timestamp: Date.now(),
      };

      await new PublishCommand([channel, JSON.stringify(testMessage)]).exec(client);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await subscribePromise;

      expect(
        logs.some(
          (log) =>
            log[0] === "message" && log[1] === channel && log[2].message === testMessage.message
        )
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }
  }, 10000);

  test("multiple subscribers receive same message", async () => {
    const channel = "test-multi-sub";
    const messages1: any[] = [];
    const messages2: any[] = [];

    const sub1 = new SubscribeCommand([channel], {
      onMessage: (message) => messages1.push(JSON.parse(message)),
    });
    const sub2 = new SubscribeCommand([channel], {
      onMessage: (message) => messages2.push(JSON.parse(message)),
    });

    const [promise1, promise2] = [sub1.exec(client), sub2.exec(client)];
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const testMessage = {
      user: "testUser",
      message: "Broadcast",
      timestamp: Date.now(),
    };

    await new PublishCommand([channel, JSON.stringify(testMessage)]).exec(client);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await Promise.all([promise1, promise2]);

    expect(messages1[0]).toEqual(testMessage);
    expect(messages2[0]).toEqual(testMessage);
    expect(messages1).toEqual(messages2);
  }, 15000);
});
