import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/srem
 */
export class SRemCommand<TData = string> extends Command<number, number> {
  constructor(key: string, ...members: NonEmptyArray<TData>) {
    super(["srem", key, ...members]);
  }
}
