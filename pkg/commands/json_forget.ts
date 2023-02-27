import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.forget
 */
export class JsonForgetCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<number, number>,
  ) {
    super(["JSON.FORGET", ...cmd], opts);
  }
}
