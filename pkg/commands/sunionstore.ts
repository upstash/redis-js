import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/sunionstore
 */
export class SUnionStoreCommand extends Command<number, number> {
  constructor(
    cmd: [destination: string, key: string, ...keys: string[]],
    opts?: CommandOptions<number, number>,
  ) {
    super(["sunionstore", ...cmd], opts);
  }
}
