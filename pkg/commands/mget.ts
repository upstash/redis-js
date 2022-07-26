import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData extends unknown[]> extends Command<
  (string | null)[],
  TData
> {
  constructor(
    cmd: [...keys: string[]],
    opts?: CommandOptions<(string | null)[], TData>,
  ) {
    super(["mget", ...cmd], opts);
  }
}
