import { Command } from "../command"

/**
 * @see https://redis.io/commands/sunionstore
 */
export class SUnionStoreCommand extends Command<number> {
  constructor(destination: string, key: string, ...keys: string[]) {
    super(["sunionstore", destination, key, ...keys])
  }
}
