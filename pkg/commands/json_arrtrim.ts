import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.arrtrim
 */
export class JsonArrTrimCommand
  extends Command<(null | string)[], (null | number)[]> {
  constructor(
    cmd: [key: string, path?: string, start?: number, stop?: number],
    opts?: CommandOptions<(null | string)[], (null | number)[]>,
  ) {
    const path = cmd[1] ?? "$";
    const start = cmd[2] ?? 0;
    const stop = cmd[3] ?? 0;

    super(["JSON.ARRTRIM", cmd[0], path, start, stop], opts);
  }
}
