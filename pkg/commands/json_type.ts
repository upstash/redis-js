import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.type
 */
export class JsonTypeCommand extends Command<string[], string[]> {
  constructor(cmd: [key: string, path?: string], opts?: CommandOptions<string[], string[]>) {
    super(["JSON.TYPE", ...cmd], opts);
  }
}
