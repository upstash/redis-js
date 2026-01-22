import type { CommandOptions } from "./command";
import { Command } from "./command";

function deserialize<TData extends Record<string, unknown>>(
  fields: (string | number)[],
  result: (string | null)[]
): TData | null {
  if (result.every((field) => field === null)) {
    return null;
  }
  const obj: Record<string, unknown> = {};
  for (const [i, field] of fields.entries()) {
    const fieldKey = String(field);
    try {
      obj[fieldKey] = JSON.parse(result[i]!);
    } catch {
      obj[fieldKey] = result[i];
    }
  }
  return obj as TData;
}

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
      deserialize: (result) => deserialize<TData>(fields, result),
      ...opts,
    });
  }
}
