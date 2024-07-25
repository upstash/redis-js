import { Command, CommandOptions } from "./command";

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
    while (e.length >= 2) {
      const streamId = e.shift() as string;
      const entries = e.shift()!;

      if (!(streamId in obj)) {
        obj[streamId] = {};
      }
      while (entries.length >= 2) {
        const field = (entries as string[]).shift()! as string;
        const value = (entries as string[]).shift()! as string;

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
