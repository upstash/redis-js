import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/rpush
 */
export class RPushCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: TData[]], opts?: CommandOptions<number, number>) {
    super(["rpush", ...cmd], opts);
  }
}
