import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/rpushx
 */
export class RPushXCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: TData[]], opts?: CommandOptions<number, number>) {
    super(["rpushx", ...cmd], opts);
  }
}
