import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/sadd
 */
export class SAddCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, member: TData, ...members: TData[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["sadd", ...cmd], opts);
  }
}
