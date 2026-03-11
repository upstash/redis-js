import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["exists", ...cmd], opts);
  }
}
