import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/sunion
 */
export class SUnionCommand<TData> extends Command<string[], TData[]> {
  constructor(
    cmd: [key: string, ...keys: string[]],
    opts?: CommandOptions<string[], TData[]>,
  ) {
    super(["sunion", ...cmd], opts);
  }
}
