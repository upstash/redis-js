import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hlen
 * @see node_modules/@upstash/redis/docs/commands/hash/hlen.mdx
 */
export class HLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["hlen", ...cmd], opts);
  }
}
