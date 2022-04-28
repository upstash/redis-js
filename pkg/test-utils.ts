import { DelCommand } from "./commands/del.ts";
import { HttpClient } from "./http.ts";
import { NonEmptyArray } from "./types.ts";

/**
 * crypto.randomUUID() is not available in dnt crypto shim
 */
export function randomID(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  const s: string[] = [];
  for (let i = 0; i < bytes.byteLength; i++) {
    s.push(String.fromCharCode(bytes[i]));
  }
  return btoa(s.join(""));
}
export const newHttpClient = () => {
  const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
  if (!url) {
    throw new Error("Could not find url");
  }
  const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
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
      const key = randomID();
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
