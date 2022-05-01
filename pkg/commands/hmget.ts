import { Command, CommandOptions } from "./command.ts";

function deserialize<TData extends Record<string, unknown>>(
  fields: string[],
  result: (string | null)[],
): TData | null {
  if (result.length === 0 || result.every((field) => field === null)) {
    return null;
  }
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < fields.length; i++) {
    try {
      obj[fields[i]] = JSON.parse(result[i]!);
    } catch {
      obj[fields[i]] = result[i];
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
 */
export class HMGetCommand<
  TData extends Record<string, unknown>,
> extends Command<(string | null)[], TData | null> {
  constructor(
    [key, ...fields]: [key: string, ...fields: string[]],
    opts?: CommandOptions<(string | null)[], TData | null>,
  ) {
    super(["hmget", key, ...fields], {
      deserialize: (result) => deserialize<TData>(fields, result),
      ...opts,
    });
  }
}
