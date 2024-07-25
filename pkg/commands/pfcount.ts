import type { CommandOptions } from "./command.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/pfcount
 */
export class PfCountCommand extends Command<number, number> {
  constructor(cmd: [string, ...string[]], opts?: CommandOptions<number, number>) {
    super(["pfcount", ...cmd], opts);
  }
}
