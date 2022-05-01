import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/randomkey
 */
export class RandomKeyCommand extends Command<string | null, string | null> {
  constructor(opts?: CommandOptions<string | null, string | null>) {
    super(["randomkey"], opts);
  }
}
