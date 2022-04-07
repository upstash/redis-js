import { Command } from "./command"
/**
 * @see https://redis.io/commands/ping
 */
export class PingCommand extends Command<string | "PONG", string | "PONG"> {
  constructor(cmd: [message?: string]) {
    const command: string[] = ["ping"]
    if (typeof cmd[0] !== "undefined") {
      command.push(cmd[0])
    }
    super(command)
  }
}
