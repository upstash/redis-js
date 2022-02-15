import { Command } from "../command"
/**
 * @see https://redis.io/commands/sdiffstpre
 */
export class SDiffStoreCommand extends Command<number> {
  constructor(destination: string, ...keys: [string, string[]]) {
    super(["sdiffstore", destination, ...keys])
  }
}
