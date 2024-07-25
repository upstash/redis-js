import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.strlen
 */
export class JsonStrLenCommand extends Command<(number | null)[], (number | null)[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<(number | null)[], (number | null)[]>
  ) {
    super(["JSON.STRLEN", ...cmd], opts);
  }
}
