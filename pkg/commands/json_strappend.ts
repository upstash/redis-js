import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.strappend
 */
export class JsonStrAppendCommand<TData extends unknown[]>
  extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path: string, value: string],
    opts?: CommandOptions<(null | string)[], (null | number)[]>,
  ) {
    super(["JSON.STRAPPEND", ...cmd], opts);
  }
}
