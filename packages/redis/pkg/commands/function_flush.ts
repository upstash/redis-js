import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/function-flush/
 * @see node_modules/@upstash/redis/docs/commands/functions/flush.mdx
 */
export class FunctionFlushCommand extends Command<"OK", "OK"> {
  constructor(opts?: CommandOptions<"OK", "OK">) {
    super(["function", "flush"], opts);
  }
}
