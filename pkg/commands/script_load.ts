import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/script-load
 */
export class ScriptLoadCommand extends Command<string, string> {
  constructor(args: [script: string], opts?: CommandOptions<string, string>) {
    super(["script", "load", ...args], opts);
  }
}
