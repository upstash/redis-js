import { Command } from "../command"
/**
 * @see https://redis.io/commands/sdiff
 */
export class SDiffCommand<TData> extends Command<TData[]> {
  constructor(key: string, ...keys: string[]) {
    super(["sdiff", key, ...keys])
  }
}
