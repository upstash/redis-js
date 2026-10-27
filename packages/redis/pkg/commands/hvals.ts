import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/hvals
 * @see node_modules/@upstash/redis/docs/commands/hash/hvals.mdx
 */
export class HValsCommand<TData extends unknown[]> extends Command<unknown[], TData> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown[], TData>) {
    super(["hvals", ...cmd], opts);
  }
}
