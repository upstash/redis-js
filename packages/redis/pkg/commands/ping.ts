import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/ping
 */
export class PingCommand extends Command<string | "PONG", string | "PONG"> {
  constructor(cmd?: [message?: string], opts?: CommandOptions<string | "PONG", string | "PONG">) {
    const command: string[] = ["ping"];
    if (cmd?.[0] !== undefined) {
      command.push(cmd[0]);
    }
    super(command, opts);
  }
}
