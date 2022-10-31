import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/getdel
 */
export class GetDelCommand<TData = string> extends Command<
  unknown | null,
  TData | null
> {
  constructor(
    cmd: [key: string],
    opts?: CommandOptions<unknown | null, TData | null>,
  ) {
    super(["getdel", ...cmd], opts);
  }
}
