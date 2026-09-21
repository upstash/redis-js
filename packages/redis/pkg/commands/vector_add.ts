import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { VectorInput } from "./vector/types";
import { serializeVector } from "./vector/utils";

/**
 * Adds a vector to an index, or overwrites the vector stored under `id`.
 *
 * Returns `1` if a new vector was inserted, `0` if an existing one was overwritten.
 */
export class VectorAddCommand extends Command<0 | 1, 0 | 1> {
  constructor(
    [index, id, vector]: [index: string, id: string, vector: VectorInput],
    cmdOpts?: CommandOptions<0 | 1, 0 | 1>
  ) {
    super(["VECTOR.ADD", index, id, ...serializeVector(vector)], cmdOpts);
  }
}
