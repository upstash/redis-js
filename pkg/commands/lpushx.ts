import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/lpushx
 */
export class LPushXCommand<TData> extends Command<number, number> {
  constructor(key: string, ...elements: NonEmptyArray<TData>) {
    super(["lpushx", key, ...elements]);
  }
}
