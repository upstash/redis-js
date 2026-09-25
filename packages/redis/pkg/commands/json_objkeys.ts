import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.objkeys
 * @see node_modules/@upstash/redis/docs/commands/json/objkeys.mdx
 */
export class JsonObjKeysCommand extends Command<(string[] | null)[], (string[] | null)[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<(string[] | null)[], (string[] | null)[]>
  ) {
    super(["JSON.OBJKEYS", ...cmd], opts);
  }
}
