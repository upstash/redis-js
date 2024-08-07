import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/incrbyfloat
 */
export class IncrByFloatCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: number], opts?: CommandOptions<number, number>) {
    super(["incrbyfloat", ...cmd], opts);
  }
}
