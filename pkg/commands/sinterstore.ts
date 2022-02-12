import { Command } from "../command"
/**
 * @see https://redis.io/commands/sinterstore
 */
export class SInterStoreCommand<TValue = string> extends Command<TValue[]> {
  constructor(destination: string, key: string, ...keys: string[]) {
    super(["sinterstore", destination, key, ...keys])
  }
}
