import { Command } from "./command"

/**
 * @see https://redis.io/commands/script-load
 */
export class ScriptLoadCommand extends Command<string, string> {
  constructor(script: string) {
    super(["script", "load", script])
  }
}
