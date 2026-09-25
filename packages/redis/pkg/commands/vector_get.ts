import type { CommandOptions } from "./command";
import { Command } from "./command";
import { deserializeVectorValues } from "./vector/utils";

/**
 * Returns the vector stored under `id`, or `null` if it does not exist.
 */
export class VectorGetCommand extends Command<(string | number)[] | null, number[] | null> {
  constructor(
    [index, id]: [index: string, id: string],
    cmdOpts?: CommandOptions<(string | number)[] | null, number[] | null>
  ) {
    super(["VECTOR.GET", index, id], {
      deserialize: deserializeVectorValues,
      ...cmdOpts,
    });
  }
}
