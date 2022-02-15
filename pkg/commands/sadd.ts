import { NonEmptyArray } from "../types"
import { Command } from "../command"

/**
 * @see https://redis.io/commands/sadd
 */
export class SAddCommand<TData = string> extends Command<number> {
  constructor(key: string, ...members: NonEmptyArray<TData>) {
    super(["sadd", key, ...members])
  }
}
