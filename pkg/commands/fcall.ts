import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/fcall/
 */
export class FCallCommand<TData> extends Command<unknown, TData> {
  constructor(
    [fn, keys, args]: [fn: string, keys?: string[], args?: string[]],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["fcall", fn, ...(keys ? [keys.length, ...keys] : []), ...(args ?? [])], opts);
  }
}
