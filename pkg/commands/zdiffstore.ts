import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/zdiffstore
 */
export class ZDiffStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, numkeys: number, ...keys: string[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["zdiffstore", ...cmd], opts);
  }
}
