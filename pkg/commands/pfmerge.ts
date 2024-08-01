import type { CommandOptions } from "./command.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/pfmerge
 */
export class PfMergeCommand extends Command<"OK", "OK"> {
  constructor(cmd: [destination_key: string, ...string[]], opts?: CommandOptions<"OK", "OK">) {
    super(["pfmerge", ...cmd], opts);
  }
}
