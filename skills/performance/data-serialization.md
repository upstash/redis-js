# Data Serialization and Deserialization

## Overview

Automatic serialization preserves JavaScript types across Redis operations. Numbers stay numbers, objects stay objects, arrays stay arrays.

## Good For

- Storing any JavaScript value without JSON.stringify/parse
- Type preservation across GET/SET
- Cleaner code (no manual serialization)
- Storing numbers, booleans, objects, arrays, null

## Limitations

- undefined, functions, symbols cannot be serialized
- Date objects serialize as ISO strings
- Class instances lose their prototype
- Binary data requires special handling

## Examples

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Numbers preserved
await redis.set("age", 42);
const age = await redis.get("age");
console.log(typeof age); // "number"
console.log(age === 42); // true

// Compare with other SDKs
// ioredis: returns "42" (string)
// @upstash/redis: returns 42 (number)

// Booleans preserved
await redis.set("active", true);
const active = await redis.get("active");
console.log(typeof active); // "boolean"

// Objects preserved
await redis.set("user", { name: "Alice", age: 30 });
const user = await redis.get("user");
console.log(user.name); // "Alice"
console.log(user.age); // 30 (number, not string)

// Arrays preserved
await redis.set("scores", [100, 200, 300]);
const scores = await redis.get<number[]>("scores");
console.log(scores[0]); // 100 (number)

// Nested structures preserved
await redis.set("data", {
  user: { name: "Alice", age: 30 },
  scores: [100, 200, 300],
  active: true,
  count: 42,
});

const data = await redis.get<any>("data");
console.log(typeof data.age); // "number"
console.log(Array.isArray(data.scores)); // true

// null preserved
await redis.set("empty", null);
const empty = await redis.get("empty");
console.log(empty === null); // true

// undefined not supported
await redis.set("undef", undefined); // Stores null

// Date objects become ISO strings
await redis.set("created", new Date());
const created = await redis.get<string>("created");
console.log(typeof created); // "string"
console.log(created); // "2024-01-01T00:00:00.000Z"

// Convert back to Date
const createdDate = new Date(created);

// Class instances lose prototype
class User {
  constructor(public name: string) {}
  greet() {
    return `Hello, ${this.name}`;
  }
}

const alice = new User("Alice");
await redis.set("instance", alice);

const retrieved = await redis.get<any>("instance");
console.log(retrieved.name); // "Alice"
console.log(retrieved.greet); // undefined (method lost)

// Solution: serialize/deserialize manually
class SerializableUser {
  constructor(public name: string) {}

  static toRedis(user: SerializableUser) {
    return { name: user.name };
  }

  static fromRedis(data: any) {
    return new SerializableUser(data.name);
  }
}

await redis.set("ser_user", SerializableUser.toRedis(alice));
const serRetrieved = SerializableUser.fromRedis(await redis.get("ser_user"));

// Disable auto-serialization if needed
const redisNoAuto = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  automaticDeserialization: false,
});

await redisNoAuto.set("key", JSON.stringify({ value: 42 }));
const raw = await redisNoAuto.get("key");
console.log(typeof raw); // "string"
const parsed = JSON.parse(raw as string);

// Binary data: use Buffer or Uint8Array
const buffer = Buffer.from("hello");
await redis.set("binary", buffer.toString("base64"));

const retrieved = await redis.get<string>("binary");
const decoded = Buffer.from(retrieved!, "base64");

// Performance: auto-serialization adds minimal overhead
const bigObject = {
  users: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    age: 20 + (i % 50),
  })),
};

const start = Date.now();
await redis.set("big", bigObject);
const stored = Date.now() - start;

const start2 = Date.now();
const retrieved = await redis.get("big");
const retrieved = Date.now() - start2;

console.log(`Store: ${stored}ms, Retrieve: ${retrieved}ms`);

// Type safety with TypeScript
interface UserProfile {
  name: string;
  age: number;
  active: boolean;
}

await redis.set<UserProfile>("profile", {
  name: "Alice",
  age: 30,
  active: true,
});

const profile = await redis.get<UserProfile>("profile");
if (profile) {
  console.log(profile.name); // Type-safe access
}
```
