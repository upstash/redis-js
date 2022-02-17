import { Command } from "../command"
/**
 * @see https://redis.io/commands/zpopmin
 */
export class ZPopMinCommand<TData> extends Command<TData[], string[]> {
  constructor(key: string, count?: number) {
    const command: unknown[] = ["zpopmin", key]
    if (typeof count === "number") {
      command.push(count)
    }
    super(command)
  }
}
