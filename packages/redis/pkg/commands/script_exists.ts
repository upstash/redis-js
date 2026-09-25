import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/script-exists
 * @see node_modules/@upstash/redis/docs/commands/scripts/script_exists.mdx
 */
export class ScriptExistsCommand<T extends string[]> extends Command<string[], number[]> {
  constructor(hashes: T, opts?: CommandOptions<string[], number[]>) {
    super(["script", "exists", ...hashes], {
      deserialize: (result) => result as unknown as number[],
      ...opts,
    });
  }
}
