import type { CommandOptions } from "./command";
import { Command } from "./command";

export class XRevRangeCommand<
  TData extends Record<string, Record<string, unknown>>,
> extends Command<string[][], TData> {
  constructor(
    [key, end, start, count]: [key: string, end: string, start: string, count?: number],
    opts?: CommandOptions<unknown[], TData[]>
  ) {
    const command: unknown[] = ["XREVRANGE", key, end, start];
    if (typeof count === "number") {
      command.push("COUNT", count);
    }
    super(command, {
      deserialize: (result) => deserialize<any>(result as any),
      ...opts,
    });
  }
}

function deserialize<TData extends Record<string, Record<string, unknown>>>(
  result: [string, string[]][]
): TData {
  const obj: Record<string, Record<string, unknown>> = {};
  for (const e of result) {
    for (let i = 0; i < e.length; i += 2) {
      const streamId = e[i] as string;
      const entries = e[i + 1];

      if (!(streamId in obj)) {
        obj[streamId] = {};
      }
      for (let j = 0; j < entries.length; j += 2) {
        const field = (entries as string[])[j];
        const value = (entries as string[])[j + 1];

        try {
          obj[streamId][field] = JSON.parse(value);
        } catch {
          obj[streamId][field] = value;
        }
      }
    }
  }
  return obj as TData;
}
