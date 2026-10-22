import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.objlen
 * @see node_modules/@upstash/redis/docs/commands/json/objlen.mdx
 */
export class JsonObjLenCommand extends Command<(number | null)[], (number | null)[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<(number | null)[], (number | null)[]>
  ) {
    super(["JSON.OBJLEN", ...cmd], opts);
  }
}
