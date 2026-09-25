import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Returns the number of vectors in the index. A missing index counts as `0`.
 */
export class VectorCountCommand extends Command<number, number> {
  constructor([index]: [index: string], cmdOpts?: CommandOptions<number, number>) {
    super(["VECTOR.COUNT", index], cmdOpts);
  }
}
