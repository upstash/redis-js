import { Command } from "../command"
/**
 * @see https://redis.io/commands/sinter
 */
export class SInterCommand<TValue = string> extends Command<TValue[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sinter", key, ...keys])
  }
}
