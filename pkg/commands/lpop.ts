import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/lpop
 */
export class LPopCommand<TData = string> extends Command<
  unknown | null,
  TData | null
> {
  constructor(
    cmd: [key: string, count?: number],
    opts?: CommandOptions<unknown | null, TData | null>,
  ) {
    super(["lpop", ...cmd], opts);
  }
}
