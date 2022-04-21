import { NonEmptyArray } from "../types";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/exists
 */
export class ExistsCommand extends Command<number, number> {
  constructor(cmd: [...keys: NonEmptyArray<string>]) {
    super(["exists", ...cmd])
  }
}
