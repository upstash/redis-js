import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/echo
 */
export class EchoCommand extends Command<string, string> {
  constructor(cmd: [message: string], opts?: CommandOptions<string, string>) {
    super(["echo", ...cmd], opts);
  }
}
