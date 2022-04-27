import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/hkeys
 */
export class HKeysCommand extends Command<string[], string[]> {
  constructor(key: string) {
    super(["hkeys", key]);
  }
}
