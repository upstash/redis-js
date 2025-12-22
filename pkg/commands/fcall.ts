import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/fcall/
 */
export class FCallCommand<TData> extends Command<unknown, TData> {
  constructor(
    [functionName, keys, args]: [functionName: string, keys?: string[], args?: string[]],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["fcall", functionName, ...(keys ? [keys.length, ...keys] : [0]), ...(args ?? [])], opts);
  }
}
