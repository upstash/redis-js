import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/sinterstore
 */
export class SInterStoreCommand<TData = string> extends Command<
  unknown[],
  TData[]
> {
  constructor(
    cmd: [destination: string, key: string, ...keys: string[]],
    opts?: CommandOptions<unknown[], TData[]>,
  ) {
    super(["sinterstore", ...cmd], opts);
  }
}
