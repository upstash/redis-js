import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/scard
 * @see node_modules/@upstash/redis/docs/commands/set/scard.mdx
 */
export class SCardCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["scard", ...cmd], opts);
  }
}
