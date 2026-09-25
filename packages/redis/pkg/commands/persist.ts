import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/persist
 * @see node_modules/@upstash/redis/docs/commands/generic/persist.mdx
 */
export class PersistCommand extends Command<"0" | "1", 0 | 1> {
  constructor(cmd: [key: string], opts?: CommandOptions<"0" | "1", 0 | 1>) {
    super(["persist", ...cmd], opts);
  }
}
