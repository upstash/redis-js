import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.strlen
 * @see node_modules/@upstash/redis/docs/commands/json/strlen.mdx
 */
export class JsonStrLenCommand extends Command<(number | null)[], (number | null)[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<(number | null)[], (number | null)[]>
  ) {
    super(["JSON.STRLEN", ...cmd], opts);
  }
}
