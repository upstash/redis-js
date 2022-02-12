import { Command } from "../command"
/**
 * @see https://redis.io/commands/ping
 */
export class PingCommand<TData> extends Command<string | "PONG"> {
  constructor(message?: TData) {
    const command: unknown[] = ["ping"]
    if (typeof message !== "undefined") {
      command.push(message)
    }
    super(command)
  }
}
