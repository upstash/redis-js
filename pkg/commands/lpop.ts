import { Command } from "./command"

/**
 * @see https://redis.io/commands/lpop
 */
export class LPopCommand<TData = string> extends Command<TData | null, unknown | null> {
  constructor(cmd: [key: string]) {
    super(["lpop", ...cmd])
  }
}
