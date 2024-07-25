import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sinter
 */
export class SInterCommand<TData = string> extends Command<unknown[], TData[]> {
  constructor(cmd: [key: string, ...keys: string[]], opts?: CommandOptions<unknown[], TData[]>) {
    super(["sinter", ...cmd], opts);
  }
}
