import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/strlen
 * @see node_modules/@upstash/redis/docs/commands/string/strlen.mdx
 */
export class StrLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["strlen", ...cmd], opts);
  }
}
