import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/json.toggle
 */
export class JsonToggleCommand extends Command<number[], number[]> {
  constructor(cmd: [key: string, path: string], opts?: CommandOptions<number[], number[]>) {
    super(["JSON.TOGGLE", ...cmd], opts);
  }
}
