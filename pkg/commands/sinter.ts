import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/sinter
 */
export class SInterCommand<TData = string> extends Command<unknown[], TData[]> {
  constructor(
    cmd: [key: string, ...keys: string[]],
    opts?: CommandOptions<unknown[], TData[]>,
  ) {
    super(["sinter", ...cmd], opts);
  }
}
