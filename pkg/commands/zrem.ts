import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/zrem
 */
export class ZRemCommand<TData = string> extends Command<number, number> {
  constructor(key: string, ...members: NonEmptyArray<TData>) {
    super(["zrem", key, ...members]);
  }
}
