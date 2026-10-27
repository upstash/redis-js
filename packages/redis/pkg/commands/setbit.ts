import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/setbit
 * @see node_modules/@upstash/redis/docs/commands/bitmap/setbit.mdx
 */

export class SetBitCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, offset: number, value: 0 | 1],
    opts?: CommandOptions<"0" | "1", 0 | 1>
  ) {
    super(["setbit", ...cmd], opts);
  }
}
