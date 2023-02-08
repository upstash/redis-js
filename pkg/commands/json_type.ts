import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/json.type
 */
export class JsonTypeCommand extends Command<string[], string[]> {
  constructor(
    cmd: [key: string, path?: string],
    opts?: CommandOptions<string[], string[]>,
  ) {
    super(["JSON.TYPE", ...cmd], opts);
  }
}
