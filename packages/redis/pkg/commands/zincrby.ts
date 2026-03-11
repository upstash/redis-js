import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zincrby
 */
export class ZIncrByCommand<TData> extends Command<number, number> {
  constructor(
    cmd: [key: string, increment: number, member: TData],
    opts?: CommandOptions<number, number>
  ) {
    super(["zincrby", ...cmd], opts);
  }
}
