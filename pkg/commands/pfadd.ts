import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/pfadd
 */
export class PfAddCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [string, ...(TData[] | TData[])],
    opts?: CommandOptions<number, number>
  ) {
    super(["pfadd", ...cmd], opts);
  }
}
