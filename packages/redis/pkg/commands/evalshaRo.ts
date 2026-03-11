import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/evalsha_ro
 */
export class EvalshaROCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(
    [sha, keys, args]: [sha: string, keys: string[], args?: TArgs],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["evalsha_ro", sha, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
