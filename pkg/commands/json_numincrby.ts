import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.numincrby
 */
export class JsonNumIncrByCommand extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path: string, value: number],
    opts?: CommandOptions<(null | string)[], (null | number)[]>
  ) {
    super(["JSON.NUMINCRBY", ...cmd], opts);
  }
}
