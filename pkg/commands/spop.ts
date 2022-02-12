import { Command } from "../command"
/**
 * @see https://redis.io/commands/spop
 */
export class SPopCommand<TResult = number> extends Command<TResult> {
  constructor(key: string, count?: number) {
    const command: unknown[] = ["spop", key]
    if (typeof count === "number") {
      command.push(count)
    }
    super(command)
  }
}
