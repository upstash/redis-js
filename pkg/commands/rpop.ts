import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/rpop
 */
export class RPopCommand<TData = string> extends Command<
  unknown | null,
  TData | null
> {
  constructor(
    cmd: [key: string],
    opts?: CommandOptions<unknown | null, TData | null>,
  ) {
    super(["rpop", ...cmd], opts);
  }
}
