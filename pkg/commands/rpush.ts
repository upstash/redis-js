import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/rpush
 */
export class RPushCommand<TData = string> extends Command<number, number> {
  constructor(
    cmd: [key: string, ...elements: TData[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["rpush", ...cmd], opts);
  }
}
