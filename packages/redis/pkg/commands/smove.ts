import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/smove
 * @see node_modules/@upstash/redis/docs/commands/set/smove.mdx
 */
export class SMoveCommand<TData> extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [source: string, destination: string, member: TData],
    opts?: CommandOptions<"0" | "1", 0 | 1>
  ) {
    super(["smove", ...cmd], opts);
  }
}
