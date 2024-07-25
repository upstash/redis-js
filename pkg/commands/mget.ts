import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData extends unknown[]> extends Command<(string | null)[], TData> {
  constructor(cmd: [string[]] | [...string[]], opts?: CommandOptions<(string | null)[], TData>) {
    const keys = Array.isArray(cmd[0]) ? cmd[0] : (cmd as string[]);
    super(["mget", ...keys], opts);
  }
}
