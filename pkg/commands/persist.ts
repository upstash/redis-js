import { Command } from "./command"

/**
 * @see https://redis.io/commands/persist
 */
export class PersistCommand extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string]) {
    super(["persist", ...cmd])
  }
}
