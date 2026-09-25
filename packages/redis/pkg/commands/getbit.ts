import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/getbit
 * @see node_modules/@upstash/redis/docs/commands/bitmap/getbit.mdx
 */
export class GetBitCommand extends Command<"0" | "1", 0 | 1> {
  constructor(cmd: [key: string, offset: number], opts?: CommandOptions<"0" | "1", 0 | 1>) {
    super(["getbit", ...cmd], opts);
  }
}
