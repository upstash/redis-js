import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.clear
 */
export class JsonClearCommand extends Command<number, number> {
  constructor(cmd: [key: string, path?: string], opts?: CommandOptions<number, number>) {
    super(["JSON.CLEAR", ...cmd], opts);
  }
}
