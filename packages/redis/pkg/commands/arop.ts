import type { CommandOptions } from "./command";
import { Command } from "./command";

type ArOpKeyword = "SUM" | "MIN" | "MAX" | "AND" | "OR" | "XOR" | "USED";

/**
 * Reduction applied by `AROP`:
 * - `SUM`, `MIN`, `MAX`: numeric aggregates
 * - `AND`, `OR`, `XOR`: bitwise folds over the values as 64-bit integers
 * - `USED`: number of occupied slots
 * - `{ match: value }`: number of slots whose value equals `value`
 */
export type ArOpOperation<TData = string> = ArOpKeyword | Lowercase<ArOpKeyword> | { match: TData };

/**
 * Reduces the values in the inclusive range `[start, end]` to a single number on the server.
 *
 * `SUM`, `MIN`, `MAX`, `AND`, `OR` and `XOR` skip non-numeric values and return `null` when the
 * range contains nothing they could use. `USED` and `match` always return a number.
 *
 * Results are returned as JavaScript numbers, so bitwise results beyond `Number.MAX_SAFE_INTEGER`
 * lose precision.
 *
 * @see https://upstash.com/docs/redis/commands/array/arop
 */
export class ArOpCommand<TData = string> extends Command<string | number | null, number | null> {
  constructor(
    [key, start, end, operation]: [
      key: string,
      start: number | string,
      end: number | string,
      operation: ArOpOperation<TData>,
    ],
    opts?: CommandOptions<string | number | null, number | null>
  ) {
    const command: unknown[] = ["AROP", key, start, end];
    if (typeof operation === "string") {
      command.push(operation.toUpperCase());
    } else {
      command.push("MATCH", operation.match);
    }
    super(command, {
      deserialize: (result) => (result === null ? null : Number(result)),
      ...opts,
    });
  }
}
