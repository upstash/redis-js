import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/decr
 */
export class DecrCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["decr", ...cmd], opts);
  }
}
