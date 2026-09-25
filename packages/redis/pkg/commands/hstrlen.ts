import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hstrlen
 * @see node_modules/@upstash/redis/docs/commands/hash/hstrlen.mdx
 */
export class HStrLenCommand extends Command<number, number> {
  constructor(cmd: [key: string, field: string], opts?: CommandOptions<number, number>) {
    super(["hstrlen", ...cmd], opts);
  }
}
