import { NonEmptyArray } from "../types";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/touch
 */
export class TouchCommand extends Command<number, number> {
  constructor(cmd: [...keys: NonEmptyArray<string>]) {
    super(["touch", ...cmd])
  }
}
