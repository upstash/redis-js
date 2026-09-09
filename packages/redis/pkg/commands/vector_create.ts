import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { VectorCreateOptions } from "./vector/types";

/**
 * Creates a vector index.
 *
 * Returns `1` if the index was created, `0` if it already existed (only possible with `existsOk`).
 */
export class VectorCreateCommand extends Command<0 | 1, 0 | 1> {
  constructor(
    [index, opts]: [index: string, opts: VectorCreateOptions],
    cmdOpts?: CommandOptions<0 | 1, 0 | 1>
  ) {
    const command: (string | number)[] = [
      "VECTOR.CREATE",
      index,
      "DIM",
      opts.dimension,
      "METRIC",
      opts.metric,
    ];
    if (opts.existsOk) {
      command.push("EXISTSOK");
    }
    super(command, cmdOpts);
  }
}
