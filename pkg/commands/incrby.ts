import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/incrby
 */
export class IncrByCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: number], opts?: CommandOptions<number, number>) {
    super(["incrby", ...cmd], opts);
  }
}
