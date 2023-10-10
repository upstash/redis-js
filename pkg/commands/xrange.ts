import { Command, CommandOptions } from "./command.ts";

function deserialize<TData extends Record<string, Record<string, unknown>>>(
  result: (string | string[])[],
): TData {
  if (result.length === 0) {
    return {} as TData;
  }
  const obj: Record<string, Record<string, unknown>> = {};
  while (result.length >= 2) {
    const streamId = result.shift() as string;
    const entries = result.shift()!;

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
  return obj as TData;
}

export class XRangeCommand<
  TData extends Record<string, Record<string, unknown>>,
> extends Command<
  string[][],
  TData
> {
  constructor(
    [key, start, end, count]: [
      key: string,
      start: string,
      end: string,
      count?: number,
    ],
    opts?: CommandOptions<unknown[], TData[]>,
  ) {
    const command: unknown[] = ["XRANGE", key, start, end];
    if (typeof count === "number") {
      command.push("COUNT", count);
    }
    super(command, {
      deserialize: (result) => deserialize<any>(result[0] as any),
      ...opts,
    });
  }
}
