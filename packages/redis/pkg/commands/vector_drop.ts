import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Drops the index and all vectors in it.
 *
 * Returns `1` if the index existed and was dropped, `0` otherwise.
 */
export class VectorDropCommand extends Command<0 | 1, 0 | 1> {
  constructor([index]: [index: string], cmdOpts?: CommandOptions<0 | 1, 0 | 1>) {
    super(["VECTOR.DROP", index], cmdOpts);
  }
}
