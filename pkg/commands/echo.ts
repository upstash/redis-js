import { Command } from "./command";

/**
 * @see https://redis.io/commands/echo
 */
export class EchoCommand extends Command<string, string> {
  constructor(cmd: [message: string]) {
    super(["echo", ...cmd])
  }
}
