import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/setex
 */
export class SetExCommand<TData = string> extends Command<"OK", "OK"> {
  constructor(
    cmd: [key: string, ttl: number, value: TData],
    opts?: CommandOptions<"OK", "OK">,
  ) {
    super(["setex", ...cmd], opts);
  }
}
