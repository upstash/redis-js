import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { ExpireOption } from "./expire";

/**
 * @see https://redis.io/commands/expireat
 */
export class ExpireAtCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, unix: number, option?: ExpireOption],
    opts?: CommandOptions<"0" | "1", 0 | 1>
  ) {
    super(["expireat", ...cmd], opts);
  }
}
