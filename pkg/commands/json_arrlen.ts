import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.arrlen
 */
export class JsonArrLenCommand<TValue extends unknown>
  extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<(null | string)[], (null | number)[]>,
  ) {
    super(["JSON.ARRLEN", cmd[0], cmd[1] ?? "$"], opts);
  }
}
