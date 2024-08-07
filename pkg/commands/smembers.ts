import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/smembers
 */
export class SMembersCommand<TData extends unknown[] = string[]> extends Command<unknown[], TData> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown[], TData>) {
    super(["smembers", ...cmd], opts);
  }
}
