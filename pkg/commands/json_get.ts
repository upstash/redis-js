import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.get
 */
export class JsonGetCommand<
  TData extends (unknown | Record<string, unknown>) | (unknown | Record<string, unknown>)[],
> extends Command<TData | null, TData | null> {
  constructor(
    cmd: [key: string, ...path: string[]],
    opts?: CommandOptions<TData | null, TData | null>
  ) {
    super(["JSON.GET", ...cmd], opts);
  }
}
