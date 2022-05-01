import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/sdiffstpre
 */
export class SDiffStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, ...keys: string[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["sdiffstore", ...cmd], opts);
  }
}
