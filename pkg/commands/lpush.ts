import { Command } from "../command"

/**
 * @see https://redis.io/commands/lpush
 */
export class LPushCommand<TValue = string> extends Command<number> {
  constructor(key: string, element: TValue, ...elements: TValue[]) {
    super(["lpush", key, element, ...elements])
  }
}
