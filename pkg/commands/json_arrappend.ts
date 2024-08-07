import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.arrappend
 */
export class JsonArrAppendCommand<TData extends unknown[]> extends Command<
  (null | string)[],
  (null | number)[]
> {
  constructor(
    cmd: [key: string, path: string, ...values: TData],
    opts?: CommandOptions<(null | string)[], (null | number)[]>
  ) {
    super(["JSON.ARRAPPEND", ...cmd], opts);
  }
}
