import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.arrindex
 */
export class JsonArrIndexCommand<TValue extends unknown>
  extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [
      key: string,
      path: string,
      value: TValue,
      start?: number,
      stop?: number,
    ],
    opts?: CommandOptions<(null | string)[], (null | number)[]>,
  ) {
    super(["JSON.ARRINDEX", ...cmd], opts);
  }
}
