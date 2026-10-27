import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/append
 * @see node_modules/@upstash/redis/docs/commands/string/append.mdx
 */
export class AppendCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: string], opts?: CommandOptions<number, number>) {
    super(["append", ...cmd], opts);
  }
}
