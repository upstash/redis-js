import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * A single `ARGREP` predicate:
 * - `exact`: the whole value equals the pattern
 * - `match`: the value contains the pattern as a substring
 * - `glob`: the value matches a glob pattern (`*` and `?`)
 * - `re`: the value matches a regular expression
 */
export type ArGrepPredicate =
  | { exact: string }
  | { match: string }
  | { glob: string }
  | { re: string };

export type ArGrepOptions = {
  /**
   * One or more predicates (at most 250).
   */
  predicates: ArGrepPredicate[];
  /**
   * How to combine several predicates. `OR` (the default) matches a slot when any predicate
   * matches, `AND` requires all of them.
   */
  combine?: "AND" | "OR" | "and" | "or";
  /**
   * Compare case-insensitively.
   */
  noCase?: boolean;
  /**
   * Return `[index, value]` pairs instead of bare indexes.
   */
  withValues?: boolean;
  /**
   * Maximum number of matches to return.
   */
  limit?: number;
};

/**
 * `number[]` of matching indexes, or `[index, value]` pairs when `withValues` is `true`.
 */
export type ArGrepResult<TData, TOpts extends ArGrepOptions> = TOpts extends { withValues: true }
  ? [number, TData][]
  : TOpts extends { withValues: false }
    ? number[]
    : "withValues" extends keyof TOpts
      ? number[] | [number, TData][]
      : number[];

/**
 * Returns the indexes in `[start, end]` whose value matches the given predicates, or
 * `[index, value]` pairs with `withValues`. `start` and `end` accept `"-"` and `"+"` for the lowest
 * and highest possible index.
 *
 * @see https://upstash.com/docs/redis/commands/array/argrep
 */
export class ArGrepCommand<
  TData = string,
  TOpts extends ArGrepOptions = ArGrepOptions,
> extends Command<unknown[], ArGrepResult<TData, TOpts>> {
  constructor(
    [key, start, end, opts]: [
      key: string,
      start: number | string,
      end: number | string,
      opts: TOpts,
    ],
    cmdOpts?: CommandOptions<unknown[], ArGrepResult<TData, TOpts>>
  ) {
    const command: unknown[] = ["ARGREP", key, start, end];

    for (const predicate of opts.predicates) {
      if ("exact" in predicate) {
        command.push("EXACT", predicate.exact);
      } else if ("match" in predicate) {
        command.push("MATCH", predicate.match);
      } else if ("glob" in predicate) {
        command.push("GLOB", predicate.glob);
      } else {
        command.push("RE", predicate.re);
      }
    }
    if (opts.combine) {
      command.push(opts.combine.toUpperCase());
    }
    if (opts.noCase) {
      command.push("NOCASE");
    }
    if (opts.withValues) {
      command.push("WITHVALUES");
    }
    if (opts.limit !== undefined) {
      command.push("LIMIT", opts.limit);
    }

    super(command, cmdOpts);
  }
}
