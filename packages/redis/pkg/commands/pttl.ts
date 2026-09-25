import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/pttl
 * @see node_modules/@upstash/redis/docs/commands/generic/pttl.mdx
 */
export class PTtlCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["pttl", ...cmd], opts);
  }
}
