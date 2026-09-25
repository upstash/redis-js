import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.arrappend
 * @see node_modules/@upstash/redis/docs/commands/json/arrappend.mdx
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
