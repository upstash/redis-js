import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/del
 */
export class DelCommand extends Command<number, number> {
  constructor(...keys: NonEmptyArray<string>) {
    super(["del", ...keys]);
  }
}
