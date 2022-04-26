import { NonEmptyArray } from "../types.ts";
import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/touch
 */
export class TouchCommand extends Command<number, number> {
  constructor(...keys: NonEmptyArray<string>) {
    super(["touch", ...keys]);
  }
}
