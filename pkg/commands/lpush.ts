import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/lpush
 */
export class LPushCommand<TData = string> extends Command<number, number> {
  constructor(key: string, ...elements: NonEmptyArray<TData>) {
    super(["lpush", key, ...elements]);
  }
}
