import { Command } from "./command"

/**
 * @see https://redis.io/commands/hget
 */
export class HGetCommand<TData> extends Command<TData | null, unknown | null> {
  constructor(cmd: [key: string, field: string]) {
    super(["hget", ...cmd])
  }
}
