import { expect, test, describe } from "bun:test";
import { Redis } from "../redis";
import { newHttpClient } from "../test-utils";

describe("Subscriber", () => {
  const client = newHttpClient();
  const redis = new Redis(client);

  test("receives a single published message", async () => {
    const channel = "test-single";
    const receivedMessages: any[] = [];

    const subscriber = redis.subscribe([channel]);
    subscriber.on("message", (message) => {
      receivedMessages.push(message);
    });

    // Wait for subscription to establish
    await new Promise((resolve) => setTimeout(resolve, 500));

    const testMessage = {
      user: "testUser",
      message: "Hello, World!",
      timestamp: Date.now(),
    };

    await redis.publish(channel, testMessage);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(receivedMessages).toHaveLength(1);
    expect(receivedMessages[0]).toEqual(testMessage);

    await subscriber.unsubscribe();
  }, 10_000);

  test("receives multiple messages in order", async () => {
    const channel = "test-multiple";
    const receivedMessages: any[] = [];

    const subscriber = redis.subscribe([channel]);
    subscriber.on("message", (message) => {
      receivedMessages.push(message);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const messages = [
      { user: "user1", message: "First", timestamp: Date.now() },
      { user: "user1", message: "Second", timestamp: Date.now() + 1 },
      { user: "user1", message: "Third", timestamp: Date.now() + 2 },
    ];

    for (const msg of messages) {
      await redis.publish(channel, msg);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(receivedMessages).toHaveLength(messages.length);
    expect(receivedMessages.map((m) => m.message)).toEqual(messages.map((m) => m.message));

    await subscriber.unsubscribe();
  }, 15_000);

  test("handles channel-specific messages", async () => {
    const channel = "test-specific";
    const channelMessages: any[] = [];

    const subscriber = redis.subscribe([channel]);
    subscriber.on(`message:${channel}`, (message) => {
      channelMessages.push(message);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const testMessage = {
      user: "testUser",
      message: "Channel specific",
      timestamp: Date.now(),
    };

    await redis.publish(channel, testMessage);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(channelMessages).toHaveLength(1);
    expect(channelMessages[0]).toEqual(testMessage);

    await subscriber.unsubscribe();
  }, 10_000);

  test("multiple subscribers receive same message", async () => {
    const channel = "test-multi-sub";
    const messages1: any[] = [];
    const messages2: any[] = [];

    const subscriber1 = redis.subscribe([channel]);
    const subscriber2 = redis.subscribe([channel]);

    subscriber1.on("message", (message) => messages1.push(message));
    subscriber2.on("message", (message) => messages2.push(message));

    await new Promise((resolve) => setTimeout(resolve, 500));

    const testMessage = {
      user: "testUser",
      message: "Broadcast",
      timestamp: Date.now(),
    };

    await redis.publish(channel, testMessage);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(messages1[0]).toEqual(testMessage);
    expect(messages2[0]).toEqual(testMessage);
    expect(messages1).toEqual(messages2);

    await Promise.all([subscriber1.unsubscribe(), subscriber2.unsubscribe()]);
  }, 15_000);

  test("unsubscribe from specific channel", async () => {
    const channels = ["channel1", "channel2"];
    const messages: Record<string, any[]> = {
      channel1: [],
      channel2: [],
    };

    const subscriber = redis.subscribe(channels);

    subscriber.on("messageBuffer", ({ channel, message }) => {
      messages[channel].push(message);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Send initial messages to both channels
    await redis.publish("channel1", { test: "before1" });
    await redis.publish("channel2", { test: "before2" });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify both channels received messages
    expect(messages.channel1).toHaveLength(1);
    expect(messages.channel2).toHaveLength(1);

    // Unsubscribe from channel1
    await subscriber.unsubscribe(["channel1"]);
    expect(subscriber.getSubscribedChannels()).toEqual(["channel2"]);

    // Clear messages for clean test
    messages.channel1 = [];
    messages.channel2 = [];

    // Send more messages
    await redis.publish("channel1", { test: "after1" });
    await redis.publish("channel2", { test: "after2" });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify only channel2 received message
    expect(messages.channel1).toHaveLength(0);
    expect(messages.channel2).toHaveLength(1);
    expect(messages.channel2[0]).toEqual({ test: "after2" });

    await subscriber.unsubscribe();
  }, 15_000);
});
