import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/sdiffstore
 */
export class SDiffStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, ...keys: string[]],
    opts?: CommandOptions<number, number>
  ) {
    super(["sdiffstore", ...cmd], opts);
  }
}
