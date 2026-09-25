import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/fcall/
 * @see node_modules/@upstash/redis/docs/commands/functions/call.mdx
 */
export class FCallCommand<TData> extends Command<unknown, TData> {
  constructor(
    [functionName, keys, args]: [functionName: string, keys?: string[], args?: string[]],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["fcall", functionName, ...(keys ? [keys.length, ...keys] : [0]), ...(args ?? [])], opts);
  }
}
