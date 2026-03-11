import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sintercard
 */
export class SInterCardCommand extends Command<number, number> {
  constructor(
    cmd: [keys: string[], opts?: { limit?: number }],
    cmdOpts?: CommandOptions<number, number>
  ) {
    const [keys, opts] = cmd;

    const command: unknown[] = ["sintercard", keys.length, ...keys];
    if (opts?.limit !== undefined) {
      command.push("LIMIT", opts.limit);
    }
    super(command, cmdOpts);
  }
}
