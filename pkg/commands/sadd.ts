import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/sadd
 */
export class SAddCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, ...members: TData[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["sadd", ...cmd], opts);
  }
}
