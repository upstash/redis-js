import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/append
 */
export class AppendCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: string], opts?: CommandOptions<number, number>) {
    super(["append", ...cmd], opts);
  }
}
