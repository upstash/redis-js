import { Command } from "../command"

/**
 * @see https://redis.io/commands/lpushx
 */
export class LPushXCommand<TValue = string> extends Command<number> {
  constructor(key: string, element: TValue, ...elements: TValue[]) {
    super(["lpushx", key, element, ...elements])
  }
}
