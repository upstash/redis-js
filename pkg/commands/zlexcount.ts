import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zlexcount
 */
export class ZLexCountCommand extends Command<number, number> {
  constructor(cmd: [key: string, min: string, max: string], opts?: CommandOptions<number, number>) {
    super(["zlexcount", ...cmd], opts);
  }
}
