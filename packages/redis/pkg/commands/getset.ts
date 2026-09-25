import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/getset
 * @see node_modules/@upstash/redis/docs/commands/string/getset.mdx
 */
export class GetSetCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(
    cmd: [key: string, value: TData],
    opts?: CommandOptions<unknown | null, TData | null>
  ) {
    super(["getset", ...cmd], opts);
  }
}
