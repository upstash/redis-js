import type { CommandOptions } from "./command";
import { Command } from "./command";

function deserialize<TData extends Record<string, unknown>>(result: string[]): TData | null {
  if (result.length === 0) {
    return null;
  }
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < result.length; i += 2) {
    const key = result[i];
    const value = result[i + 1];
    try {
      // handle unsafe integer
      const valueIsNumberAndNotSafeInteger =
        !Number.isNaN(Number(value)) && !Number.isSafeInteger(Number(value));
      obj[key] = valueIsNumberAndNotSafeInteger ? value : JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj as TData;
}

/**
 * @see https://redis.io/commands/hgetall
 */
export class HGetAllCommand<TData extends Record<string, unknown>> extends Command<
  unknown | null,
  TData | null
> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown | null, TData | null>) {
    super(["hgetall", ...cmd], {
      deserialize: (result) => deserialize<TData>(result as string[]),
      ...opts,
    });
  }
}
