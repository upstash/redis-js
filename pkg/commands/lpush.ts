import { NonEmptyArray } from "../types"
import { Command } from "./command"

/**
 * @see https://redis.io/commands/lpush
 */
export class LPushCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: NonEmptyArray<TData>]) {
    super(["lpush", ...cmd])
  }
}
