import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/msetnx
 * @see node_modules/@upstash/redis/docs/commands/string/msetnx.mdx
 */
export class MSetNXCommand<TData = string> extends Command<number, number> {
  constructor([kv]: [kv: Record<string, TData>], opts?: CommandOptions<number, number>) {
    super(["msetnx", ...Object.entries(kv).flat()], opts);
  }
}
