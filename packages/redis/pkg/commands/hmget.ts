import type { CommandOptions } from "./command";
import { Command } from "./command";

export function deserialize<TData extends Record<string, unknown>>(
  fields: string[],
  result: (string | null)[]
): TData | null {
  if (result.every((field) => field === null)) {
    return null;
  }
  const obj: Record<string, unknown> = {};
  for (const [i, field] of fields.entries()) {
    try {
      obj[field] = JSON.parse(result[i]!);
    } catch {
      obj[field] = result[i];
    }
  }
  return obj as TData;
}

/**
 * hmget returns an object of all requested fields from a hash
 * The field values are returned as an object like this:
 * ```ts
 * {[fieldName: string]: T | null}
 * ```
 *
 * In case the hash does not exist or all fields are empty `null` is returned
 *
 * @see https://redis.io/commands/hmget
 * @see node_modules/@upstash/redis/docs/commands/hash/hmget.mdx
 * Responses are JSON-parsed automatically: a stored JSON string comes back as an object. Pass
 * automaticDeserialization: false to the Redis constructor to receive raw strings.
 * With automaticDeserialization: false, hmget returns an array of values in field order instead,
 * such as ["123", null], with null for each field when the key is missing.
 */
export class HMGetCommand<TData extends Record<string, unknown>> extends Command<
  (string | null)[],
  TData | null
> {
  constructor(
    [key, ...fields]: [key: string, ...fields: string[]],
    opts?: CommandOptions<(string | null)[], TData | null>
  ) {
    super(["hmget", key, ...fields], {
      deserialize: (result) => deserialize<TData>(fields, result),
      ...opts,
    });
  }
}
