import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/ttl
 * @see node_modules/@upstash/redis/docs/commands/generic/ttl.mdx
 */
export class TtlCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["ttl", ...cmd], opts);
  }
}
