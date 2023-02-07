import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.del
 */
export class JsonDelCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<number, number>,
  ) {
    super(["JSON.DEL", ...cmd], opts);
  }
}
