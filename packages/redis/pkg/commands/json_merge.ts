import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.merge
 */
export class JsonMergeCommand<
  TData extends string | number | Record<string, unknown> | Array<unknown>,
> extends Command<"OK" | null, "OK" | null> {
  constructor(
    cmd: [key: string, path: string, value: TData],
    opts?: CommandOptions<"OK" | null, "OK" | null>
  ) {
    const command: unknown[] = ["JSON.MERGE", ...cmd];
    super(command, opts);
  }
}
