import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/xlen
 * @see node_modules/@upstash/redis/docs/commands/stream/xlen.mdx
 */
export class XLenCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["XLEN", ...cmd], opts);
  }
}
