import { Command } from "../command"

/**
 * @see https://redis.io/commands/rpushx
 */
export class RPushXCommand<TValue = string> extends Command<number> {
  constructor(key: string, element: TValue, ...elements: TValue[]) {
    super(["rpushx", key, element, ...elements])
  }
}
