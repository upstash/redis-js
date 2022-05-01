import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/getset
 */
export class GetSetCommand<TData = string> extends Command<
  unknown | null,
  TData | null
> {
  constructor(
    cmd: [key: string, value: TData],
    opts?: CommandOptions<unknown | null, TData | null>,
  ) {
    super(["getset", ...cmd], opts);
  }
}
