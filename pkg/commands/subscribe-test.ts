import { Redis } from "../redis";
import { newHttpClient } from "../test-utils";
const client = newHttpClient();

const redis = new Redis(client);
const subscriber = redis.subscribe(["channel1", "channel2"]);

// console.log("unsubscribed");
// await subscriber.unsubscribe(["channel1"]);

console.log("registered");
subscriber.on("message", (message) => {
  console.log("Received message:", message);
});

subscriber.on("messageBuffer", ({ channel, message }) => {
  console.log("Channel:", channel, "| Message:", message);
});

subscriber.on("message:channel1", (message) => {
  console.log("Message from channel1:", message);
});
