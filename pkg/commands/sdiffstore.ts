import { Command } from "../command"
/**
 * @see https://redis.io/commands/sdiffstpre
 */
export class SDiffStoreCommand extends Command<number> {
  constructor(destination: string, key: string, ...keys: string[]) {
    super(["sdiffstore", destination, key, ...keys])
  }
}
