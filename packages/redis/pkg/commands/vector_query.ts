import type { CommandOptions } from "./command";
import { Command } from "./command";
import type { VectorQueryOptions, VectorQueryResult } from "./vector/types";
import { deserializeVectorQueryResponse, serializeVector } from "./vector/utils";

/**
 * Returns the `topK` nearest neighbours of the query vector as `{ id, score }` pairs.
 */
export class VectorQueryCommand extends Command<[string, string | number][], VectorQueryResult[]> {
  constructor(
    [index, opts]: [index: string, opts: VectorQueryOptions],
    cmdOpts?: CommandOptions<[string, string | number][], VectorQueryResult[]>
  ) {
    const command: (string | number)[] = ["VECTOR.QUERY", index, "TOPK", opts.topK];
    if (opts.profile) {
      command.push("PROFILE", opts.profile);
    }
    command.push(...serializeVector(opts.vector));
    super(command, {
      deserialize: deserializeVectorQueryResponse,
      ...cmdOpts,
    });
  }
}
