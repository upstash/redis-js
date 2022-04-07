import { Command } from "./command"

/**
 * @see https://redis.io/commands/keys
 */
export class KeysCommand extends Command<string[], string[]> {
  constructor(cmd: [pattern: string]) {
    super(["keys", ...cmd])
  }
}
