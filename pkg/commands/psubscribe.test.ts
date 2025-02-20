import { expect, test, describe } from "bun:test";
import { Redis } from "../redis";
import { newHttpClient } from "../test-utils";

describe("Pattern Subscriber", () => {
  const client = newHttpClient();
  const redis = new Redis(client);

  test("receives pattern matched messages", async () => {
    const pattern = "user:*";
    const receivedMessages: any[] = [];

    const subscriber = redis.psubscribe([pattern]);
    subscriber.on("pmessage", (message) => {
      receivedMessages.push(message);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const testMessage = {
      user: "testUser",
      message: "Hello, World!",
      timestamp: Date.now(),
    };

    await redis.publish("user:123", testMessage);
    await redis.publish("user:456", testMessage);
    await redis.publish("other:789", testMessage); // Should not receive this
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(receivedMessages).toHaveLength(2); // Only messages from user:* channels
    expect(receivedMessages[0]).toEqual(testMessage);
    expect(receivedMessages[1]).toEqual(testMessage);

    await subscriber.unsubscribe();
  }, 10_000);

  test("handles pattern-specific messages with channel info", async () => {
    const pattern = "chat:*:messages";
    const messages: { pattern: string; channel: string; message: any }[] = [];

    const subscriber = redis.psubscribe([pattern]);
    subscriber.on("pmessageBuffer", (data) => {
      messages.push(data);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    await redis.publish("chat:room1:messages", { msg: "Hello Room 1" });
    await redis.publish("chat:room2:messages", { msg: "Hello Room 2" });
    await redis.publish("chat:room1:users", { msg: "User joined" }); // Should not receive this
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(messages).toHaveLength(2);
    expect(messages[0].pattern).toBe("chat:*:messages");
    expect(messages[0].channel).toBe("chat:room1:messages");
    expect(messages[1].channel).toBe("chat:room2:messages");

    await subscriber.unsubscribe();
  }, 10_000);

  test("handles multiple patterns", async () => {
    const patterns = ["user:*", "chat:*"];
    const messages: Record<string, any[]> = {
      "user:*": [],
      "chat:*": [],
    };

    const subscriber = redis.psubscribe(patterns);
    subscriber.on("pmessageBuffer", ({ pattern, channel, message }) => {
      messages[pattern].push({ channel, message });
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    await redis.publish("user:123", { type: "user" });
    await redis.publish("chat:room1", { type: "chat" });
    await redis.publish("other:xyz", { type: "other" }); // Should not receive this
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(messages["user:*"]).toHaveLength(1);
    expect(messages["chat:*"]).toHaveLength(1);
    expect(messages["user:*"][0].channel).toBe("user:123");
    expect(messages["chat:*"][0].channel).toBe("chat:room1");

    await subscriber.unsubscribe();
  }, 10_000);

  test("unsubscribe from specific pattern", async () => {
    const patterns = ["user:*", "chat:*"];
    const messages: Record<string, any[]> = {
      "user:*": [],
      "chat:*": [],
    };

    const subscriber = redis.psubscribe(patterns);
    subscriber.on("pmessageBuffer", ({ pattern, channel, message }) => {
      messages[pattern].push({ channel, message });
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Initial messages
    await redis.publish("user:123", { msg: "user1" });
    await redis.publish("chat:room1", { msg: "chat1" });
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(messages["user:*"]).toHaveLength(1);
    expect(messages["chat:*"]).toHaveLength(1);

    // Unsubscribe from user:* pattern
    await subscriber.unsubscribe(["user:*"]);
    expect(subscriber.getSubscribedChannels()).toEqual(["chat:*"]);

    // Clear messages
    messages["user:*"] = [];
    messages["chat:*"] = [];

    // Send more messages
    await redis.publish("user:123", { msg: "user2" });
    await redis.publish("chat:room1", { msg: "chat2" });
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(messages["user:*"]).toHaveLength(0); // Should not receive any more user messages
    expect(messages["chat:*"]).toHaveLength(1); // Should still receive chat messages
    expect(messages["chat:*"][0].message.msg).toBe("chat2");

    await subscriber.unsubscribe();
  }, 15_000);

  test("pattern and regular subscriptions work together", async () => {
    const patternSubscriber = redis.psubscribe(["user:*"]);
    const channelSubscriber = redis.subscribe(["user:123"]);

    const patternMessages: any[] = [];
    const channelMessages: any[] = [];

    patternSubscriber.on("pmessage", (message) => {
      patternMessages.push(message);
    });

    channelSubscriber.on("message", (message) => {
      channelMessages.push(message);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const testMessage = { msg: "Hello" };
    await redis.publish("user:123", testMessage);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(patternMessages).toHaveLength(1);
    expect(channelMessages).toHaveLength(1);
    expect(patternMessages[0]).toEqual(testMessage);
    expect(channelMessages[0]).toEqual(testMessage);

    await Promise.all([patternSubscriber.unsubscribe(), channelSubscriber.unsubscribe()]);
  }, 15_000);
});
