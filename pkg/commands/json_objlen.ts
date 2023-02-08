import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.objlen
 */
export class JsonObjLenCommand
  extends Command<(number | null)[], (number | null)[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<(number | null)[], (number | null)[]>,
  ) {
    super(["JSON.OBJLEN", ...cmd], opts);
  }
}
