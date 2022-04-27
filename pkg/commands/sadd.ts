import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/sadd
 */
export class SAddCommand<TData = string> extends Command<number, number> {
  constructor(key: string, ...members: NonEmptyArray<TData>) {
    super(["sadd", key, ...members]);
  }
}
