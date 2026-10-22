import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/incrbyfloat
 * @see node_modules/@upstash/redis/docs/commands/string/incrbyfloat.mdx
 */
export class IncrByFloatCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: number], opts?: CommandOptions<number, number>) {
    super(["incrbyfloat", ...cmd], opts);
  }
}
