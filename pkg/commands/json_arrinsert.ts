import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.arrinsert
 */
export class JsonArrInsertCommand<TData extends unknown[]>
  extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path: string, index: number, ...values: TData],
    opts?: CommandOptions<(null | string)[], (null | number)[]>,
  ) {
    super(["JSON.ARRINSERT", ...cmd], opts);
  }
}
