import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/llen
 * @see node_modules/@upstash/redis/docs/commands/list/llen.mdx
 */
export class LLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["llen", ...cmd], opts);
  }
}
