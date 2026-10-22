import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/mset
 * @see node_modules/@upstash/redis/docs/commands/string/mset.mdx
 */
export class MSetCommand<TData> extends Command<"OK", "OK"> {
  constructor([kv]: [kv: Record<string, TData>], opts?: CommandOptions<"OK", "OK">) {
    super(["mset", ...Object.entries(kv).flatMap(([key, value]) => [key, value])], opts);
  }
}
