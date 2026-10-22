import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/unlink
 * @see node_modules/@upstash/redis/docs/commands/generic/unlink.mdx
 */
export class UnlinkCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["unlink", ...cmd], opts);
  }
}
