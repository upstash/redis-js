import { NonEmptyArray } from "../types"
import { Command } from "./command"

/**
 * @see https://redis.io/commands/lpushx
 */
export class LPushXCommand<TData> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: NonEmptyArray<TData>]) {
    super(["lpushx", ...cmd])
  }
}
