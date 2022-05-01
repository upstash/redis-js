import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/lpush
 */
export class LPushCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, ...elements: TData[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["lpush", ...cmd], opts);
  }
}
