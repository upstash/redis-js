import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/decrby
 * @see node_modules/@upstash/redis/docs/commands/string/decrby.mdx
 */
export class DecrByCommand extends Command<number, number> {
  constructor(cmd: [key: string, decrement: number], opts?: CommandOptions<number, number>) {
    super(["decrby", ...cmd], opts);
  }
}
