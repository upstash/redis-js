import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * Index-value pairs for `ARMSET`, either as an object (`{ 0: "a", 10: "b" }`) or as a list of
 * `[index, value]` tuples.
 */
export type ArMSetValues<TData> = Record<number | string, TData> | [number | string, TData][];

/**
 * Writes several index-value pairs into an array in one atomic call.
 *
 * Returns the number of slots that were newly occupied. Overwriting an existing value contributes `0`.
 *
 * @see https://upstash.com/docs/redis/commands/array/armset
 */
export class ArMSetCommand<TData = string> extends Command<number, number> {
  constructor(
    [key, values]: [key: string, values: ArMSetValues<TData>],
    opts?: CommandOptions<number, number>
  ) {
    const pairs = Array.isArray(values) ? values : Object.entries(values);
    super(["ARMSET", key, ...pairs.flatMap(([index, value]) => [index, value])], opts);
  }
}
