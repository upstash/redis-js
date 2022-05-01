import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/sdiff
 */
export class SDiffCommand<TData> extends Command<unknown[], TData[]> {
  constructor(
    cmd: [key: string, ...keys: string[]],
    opts?: CommandOptions<unknown[], TData[]>,
  ) {
    super(["sdiff", ...cmd], opts);
  }
}
