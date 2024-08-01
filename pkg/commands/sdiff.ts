import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sdiff
 */
export class SDiffCommand<TData> extends Command<unknown[], TData[]> {
  constructor(cmd: [key: string, ...keys: string[]], opts?: CommandOptions<unknown[], TData[]>) {
    super(["sdiff", ...cmd], opts);
  }
}
