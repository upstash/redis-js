import { DelCommand } from "./commands/del";
import { XAddCommand } from "./commands/xadd";
import { HttpClient } from "./http";

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
export const randomUnsafeIntegerString = (): string => {
  const buffer = new Uint8Array(8);
  crypto.getRandomValues(buffer);
  const dataView = new DataView(buffer.buffer);
  const unsafeInteger = dataView.getBigInt64(0, true); // true for little-endian
  return unsafeInteger.toString();
};
export const newHttpClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  if (!url) {
    throw new Error("Could not find url");
  }
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
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
        await new DelCommand(keys).exec(newHttpClient());
      }
    },
  };
}

export async function addNewItemToStream(
  streamKey: string,
  client: HttpClient
) {
  const field1 = "field1";
  const member1 = randomID();
  const field2 = "field2";
  const member2 = randomID();

  const res = await new XAddCommand([
    streamKey,
    "*",
    { [field1]: member1, [field2]: member2 },
  ]).exec(client);
  return { member1, member2, streamId: res };
}
