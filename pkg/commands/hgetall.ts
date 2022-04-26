import { Command } from "./command";

/**
 * @param result De
 * @returns
 */
function deserialize<TData extends Record<string, unknown>>(result: string[]):
  | TData
  | null {
  if (result.length === 0) {
    return null;
  }
  const obj: Record<string, unknown> = {};
  while (result.length >= 2) {
    const key = result.shift()!;
    const value = result.shift()!;
    try {
      obj[key] = JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj as TData;
}

/**
 * @see https://redis.io/commands/hgetall
 */
export class HGetAllCommand<TData extends Record<string, unknown>>
  extends Command<
    TData | null,
    unknown | null
  > {
  constructor(key: string) {
    super(
      ["hgetall", key],
      { deserialize: (result) => deserialize<TData>(result as string[]) },
    );
  }
}
