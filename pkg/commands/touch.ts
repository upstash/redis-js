import { NonEmptyArray } from "../types";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/touch
 */
export class TouchCommand extends Command<number, number> {
  constructor(...keys: NonEmptyArray<string>) {
    super(["touch", ...keys]);
  }
}
