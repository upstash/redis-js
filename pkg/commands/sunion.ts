import { Command } from "./command"

/**
 * @see https://redis.io/commands/sunion
 */
export class SUnionCommand<TData> extends Command<TData[], string[]> {
  constructor(cmd: [key: string, ...keys: string[]]) {
    super(["sunion", ...cmd])
  }
}
