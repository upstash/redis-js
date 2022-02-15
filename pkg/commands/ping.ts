import { Command } from "../command"
/**
 * @see https://redis.io/commands/ping
 */
export class PingCommand extends Command<string | "PONG"> {
  constructor(message?: string) {
    const command: string[] = ["ping"]
    if (typeof message !== "undefined") {
      command.push(message)
    }
    super(command)
  }
}
