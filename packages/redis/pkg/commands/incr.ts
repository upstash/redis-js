import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/incr
 * @see node_modules/@upstash/redis/docs/commands/string/incr.mdx
 */
export class IncrCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["incr", ...cmd], opts);
  }
}
