import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hdel
 * @see node_modules/@upstash/redis/docs/commands/hash/hdel.mdx
 */
export class HDelCommand extends Command<"0" | "1", 0 | 1> {
  constructor(cmd: [key: string, ...fields: string[]], opts?: CommandOptions<"0" | "1", 0 | 1>) {
    super(["hdel", ...cmd], opts);
  }
}
