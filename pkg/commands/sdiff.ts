import { Command } from "../command"
/**
 * @see https://redis.io/commands/sdiff
 */
export class SDiffCommand<TValue> extends Command<TValue[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sdiff", key, ...keys])
  }
}
