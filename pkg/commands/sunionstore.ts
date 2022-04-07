import { Command } from "./command"

/**
 * @see https://redis.io/commands/sunionstore
 */
export class SUnionStoreCommand extends Command<number, number> {
  constructor(cmd: [destination: string, key: string, ...keys: string[]]) {
    super(["sunionstore", ...cmd])
  }
}
