import { NonEmptyArray } from "../types"
import { Command } from "./command"
/**
 * @see https://redis.io/commands/zrem
 */
export class ZRemCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...members: NonEmptyArray<TData>]) {
    super(["zrem", ...cmd])
  }
}
