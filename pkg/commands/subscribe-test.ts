/* eslint-disable no-console */
import { Redis } from "../redis";
import { newHttpClient } from "../test-utils";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  console.log("Starting PubSub test...\n");
  const client = newHttpClient();
  const redis = new Redis(client);

  // Create subscriber
  console.log("Creating subscriber for channel1 and channel2");
  const subscriber = redis.subscribe(["channel1", "channel2"]);

  // Add event listeners
  subscriber.on("message", (message) => {
    console.log("\n🔔 Generic message event:", message);
  });

  subscriber.on("messageBuffer", ({ channel, message }) => {
    console.log("📝 Message with channel:", channel, message);
  });

  subscriber.on("message:channel1", (message) => {
    console.log("1️⃣ Channel1 specific message:", message);
  });

  subscriber.on("message:channel2", (message) => {
    console.log("2️⃣ Channel2 specific message:", message);
  });

  subscriber.on("error", (error) => {
    console.error("❌ Error:", error);
  });

  // Wait for subscriptions to establish
  await sleep(1000);
  console.log("\nCurrently subscribed to:", subscriber.getSubscribedChannels());

  // Test 1: Send messages to both channels
  console.log("\n📤 Sending test messages to both channels...");
  await redis.publish("channel1", { msg: "Hello from channel 1!" });
  await redis.publish("channel2", { msg: "Hello from channel 2!" });
  await sleep(1000);

  // Test 2: Unsubscribe from channel1
  console.log("\n🚫 Unsubscribing from channel1...");
  await subscriber.unsubscribe(["channel1"]);
  console.log("Now subscribed to:", subscriber.getSubscribedChannels());

  // Test 3: Send more messages
  console.log("\n📤 Sending more messages (should only receive channel2)...");
  await redis.publish("channel1", { msg: "Channel1 - should not see this" });
  await redis.publish("channel2", { msg: "Channel2 - should see this" });
  await sleep(1000);

  // Test 4: Unsubscribe from all
  console.log("\n🚫 Unsubscribing from all channels...");
  await subscriber.unsubscribe();
  console.log("Subscribed channels:", subscriber.getSubscribedChannels());

  // Test 5: Final messages
  console.log("\n📤 Sending final messages (should receive none)...");
  await redis.publish("channel1", { msg: "Should not see this" });
  await redis.publish("channel2", { msg: "Should not see this either" });
  await sleep(1000);

  console.log("\n✅ Test completed!");
}

// Run the test
console.log("Press Ctrl+C to stop the test\n");
// eslint-disable-next-line unicorn/prefer-top-level-await
runTest().catch(console.error);
