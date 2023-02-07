import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.arrpop
 */
export class JsonArrPopCommand<TData extends unknown>
  extends Command<(null | string)[], (TData | null)[]> {
  constructor(
    cmd: [key: string, path?: string, index?: number],
    opts?: CommandOptions<(null | string)[], (TData | null)[]>,
  ) {
    super(["JSON.ARRPOP", ...cmd], opts);
  }
}
