import type { CommandOptions } from "./command";
import { Command } from "./command";

type HGetExCommandOptions =
  | { ex: number; px?: never; exat?: never; pxat?: never; persist?: never }
  | { ex?: never; px: number; exat?: never; pxat?: never; persist?: never }
  | { ex?: never; px?: never; exat: number; pxat?: never; persist?: never }
  | { ex?: never; px?: never; exat?: never; pxat: number; persist?: never }
  | { ex?: never; px?: never; exat?: never; pxat?: never; persist: true }
  | { ex?: never; px?: never; exat?: never; pxat?: never; persist?: never };

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
 * HGETEX returns the values of the specified fields and optionally sets their expiration time or TTL
 * The field values are returned as an object like this:
 * ```ts
 * {[fieldName: string]: T | null}
 * ```
 *
 * In case all fields are non-existent or the hash doesn't exist, `null` is returned
 *
 * @see https://redis.io/commands/hgetex
 */
export class HGetExCommand<TData extends Record<string, unknown>> extends Command<
  (string | null)[],
  TData | null
> {
  constructor(
    [key, opts, ...fields]: [
      key: string,
      opts?: HGetExCommandOptions,
      ...fields: (string | number)[],
    ],
    cmdOpts?: CommandOptions<(string | null)[], TData | null>
  ) {
    const command: (string | number)[] = ["hgetex", key];

    if (opts) {
      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("EX", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("PX", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("EXAT", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("PXAT", opts.pxat);
      } else if ("persist" in opts && opts.persist) {
        command.push("PERSIST");
      }
    }

    command.push("FIELDS", fields.length, ...fields);

    super(command, {
      deserialize: (result) => deserialize<TData>(fields, result),
      ...cmdOpts,
    });
  }
}
