import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/get
 */
export class GetCommand<TData = string> extends Command<
  unknown | null,
  TData | null
> {
  constructor(
    cmd: [key: string],
    opts?: CommandOptions<unknown | null, TData | null>,
  ) {
    super(["get", ...cmd], opts);
  }
}
