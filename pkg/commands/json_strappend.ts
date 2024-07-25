import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.strappend
 */
export class JsonStrAppendCommand extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path: string, value: string],
    opts?: CommandOptions<(null | string)[], (null | number)[]>
  ) {
    super(["JSON.STRAPPEND", ...cmd], opts);
  }
}
