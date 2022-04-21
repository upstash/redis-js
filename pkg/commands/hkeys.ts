import { Command } from "./command";

/**
 * @see https://redis.io/commands/hkeys
 */
export class HKeysCommand extends Command<string[], string[]> {
  constructor(cmd: [key: string]) {
    super(["hkeys", ...cmd])
  }
}
