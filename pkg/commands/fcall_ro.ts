import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/fcall_ro/
 */
export class FCallRoCommand<TData> extends Command<unknown, TData> {
  constructor(
    [functionName, keys, args]: [functionName: string, keys?: string[], args?: string[]],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(
      ["fcall_ro", functionName, ...(keys ? [keys.length, ...keys] : [0]), ...(args ?? [])],
      opts
    );
  }
}
