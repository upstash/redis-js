import type { CommandOptions } from "./command.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/pfadd
 */
export class PfAddCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [string, ...TData[]], opts?: CommandOptions<number, number>) {
    super(["pfadd", ...cmd], opts);
  }
}
