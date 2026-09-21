import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Deletes the vector stored under `id`.
 *
 * Returns `1` if the vector existed and was removed, `0` otherwise.
 */
export class VectorDelCommand extends Command<0 | 1, 0 | 1> {
  constructor([index, id]: [index: string, id: string], cmdOpts?: CommandOptions<0 | 1, 0 | 1>) {
    super(["VECTOR.DEL", index, id], cmdOpts);
  }
}
