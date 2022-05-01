import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/keys
 */
export class KeysCommand extends Command<string[], string[]> {
  constructor(
    cmd: [pattern: string],
    opts?: CommandOptions<string[], string[]>,
  ) {
    super(["keys", ...cmd], opts);
  }
}
