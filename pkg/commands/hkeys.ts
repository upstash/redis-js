import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/hkeys
 */
export class HKeysCommand extends Command<string[], string[]> {
  constructor([key]: [key: string], opts?: CommandOptions<string[], string[]>) {
    super(["hkeys", key], opts);
  }
}
