import { DelCommand } from "./commands/del";
import { HttpClient } from "./http";
import { NonEmptyArray } from "./types";
import { randomUUID } from "crypto";
import { config } from "dotenv";
import "isomorphic-fetch";

config();

export const newHttpClient = () => {
  const url = process.env["UPSTASH_REDIS_REST_URL"];
  if (!url) {
    throw new Error("Could not find url");
  }
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"];
  if (!token) {
    throw new Error("Could not find token");
  }

  return new HttpClient({
    baseUrl: url,
    headers: { authorization: `Bearer ${token}` },
  });
};

export function keygen(): {
  newKey: () => string;
  cleanup: () => Promise<void>;
} {
  const keys: string[] = [];
  return {
    newKey: () => {
      const key = randomUUID();
      keys.push(key);
      return key;
    },
    cleanup: async () => {
      if (keys.length > 0) {
        await new DelCommand(...(keys as NonEmptyArray<string>)).exec(
          newHttpClient(),
        );
      }
    },
  };
}
