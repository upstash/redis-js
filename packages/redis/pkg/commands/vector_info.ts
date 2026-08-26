import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { VectorIndexInfo } from "./vector/types";
import { deserializeVectorInfoResponse } from "./vector/utils";

/**
 * Returns the dimension and metric of the index, or `null` if it does not exist.
 */
export class VectorInfoCommand extends Command<
  (string | number)[] | Record<string, string | number> | null,
  VectorIndexInfo | null
> {
  constructor(
    [index]: [index: string],
    cmdOpts?: CommandOptions<
      (string | number)[] | Record<string, string | number> | null,
      VectorIndexInfo | null
    >
  ) {
    super(["VECTOR.INFO", index], {
      deserialize: deserializeVectorInfoResponse,
      ...cmdOpts,
    });
  }
}
