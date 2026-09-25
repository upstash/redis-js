import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.nummultby
 * @see node_modules/@upstash/redis/docs/commands/json/nummultby.mdx
 */
export class JsonNumMultByCommand extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path: string, value: number],
    opts?: CommandOptions<(null | string)[], (null | number)[]>
  ) {
    super(["JSON.NUMMULTBY", ...cmd], opts);
  }
}
