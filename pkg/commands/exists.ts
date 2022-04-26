import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<number, number> {
  constructor(...keys: NonEmptyArray<string>) {
    super(["exists", ...keys]);
  }
}
