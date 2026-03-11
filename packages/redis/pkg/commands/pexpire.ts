import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { ExpireOption } from "./expire";

/**
 * @see https://redis.io/commands/pexpire
 */
export class PExpireCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, milliseconds: number, option?: ExpireOption],
    opts?: CommandOptions<"0" | "1", 0 | 1>
  ) {
    super(["pexpire", ...cmd], opts);
  }
}
