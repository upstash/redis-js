import { NonEmptyArray } from "../types";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/srem
 */
export class SRemCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...members: NonEmptyArray<TData>]) {
    super(["srem", ...cmd])
  }
}
