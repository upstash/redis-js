import { NonEmptyArray } from "../types"
import { Command } from "../command"

/**
 * @see https://redis.io/commands/rpush
 */
export class RPushCommand<TData = string> extends Command<number, number> {
  constructor(key: string, ...elements: NonEmptyArray<TData>) {
    super(["rpush", key, ...elements])
  }
}
