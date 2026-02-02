import type { CommandOptions } from "./command";
import { Command } from "./command";
import { deserialize } from "./hmget";

/**
 * HGETDEL returns the values of the specified fields and then atomically deletes them from the hash
 * The field values are returned as an object like this:
 * ```ts
 * {[fieldName: string]: T | null}
 * ```
 *
 * In case all fields are non-existent or the hash doesn't exist, `null` is returned
 *
 * @see https://redis.io/commands/hgetdel
 */
export class HGetDelCommand<TData extends Record<string, unknown>> extends Command<
  (string | null)[],
  TData | null
> {
  constructor(
    [key, ...fields]: [key: string, ...fields: (string | number)[]],
    opts?: CommandOptions<(string | null)[], TData | null>
  ) {
    super(["hgetdel", key, "FIELDS", fields.length, ...fields], {
      deserialize: (result) => deserialize<TData>(fields.map(String), result),
      ...opts,
    });
  }
}
