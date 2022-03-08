import { NonEmptyArray } from "../types"
import { Command } from "../command"
/**
 * @see https://redis.io/commands/sdiffstpre
 */
export class SDiffStoreCommand extends Command<number, number> {
  constructor(destination: string, ...keys: NonEmptyArray<string>) {
    super(["sdiffstore", destination, ...keys])
  }
}
