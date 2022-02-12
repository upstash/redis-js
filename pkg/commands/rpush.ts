import { Command } from "../command"

/**
 * @see https://redis.io/commands/rpush
 */
export class RPushCommand<TValue = string> extends Command<number> {
  constructor(key: string, element: TValue, ...elements: TValue[]) {
    super(["rpush", key, element, ...elements])
  }
}
