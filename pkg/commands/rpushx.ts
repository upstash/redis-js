import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/rpushx
 */
export class RPushXCommand<TData = string> extends Command<number, number> {
  constructor(key: string, ...elements: NonEmptyArray<TData>) {
    super(["rpushx", key, ...elements]);
  }
}
