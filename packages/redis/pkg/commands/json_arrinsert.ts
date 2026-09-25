import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.arrinsert
 * @see node_modules/@upstash/redis/docs/commands/json/arrinsert.mdx
 */
export class JsonArrInsertCommand<TData extends unknown[]> extends Command<
  (null | string)[],
  (null | number)[]
> {
  constructor(
    cmd: [key: string, path: string, index: number, ...values: TData],
    opts?: CommandOptions<(null | string)[], (null | number)[]>
  ) {
    super(["JSON.ARRINSERT", ...cmd], opts);
  }
}
