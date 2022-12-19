import { Command, CommandOptions } from "./command.ts";

export type ZRangeCommandOptions =
  & {
    withScores?: boolean;
    rev?: boolean;
  }
  & (
    | { byScore: true; byLex?: never }
    | { byScore?: never; byLex: true }
    | { byScore?: never; byLex?: never }
  )
  & (
    | { offset: number; count: number }
    | { offset?: never; count?: never }
  );
/**
 * @see https://redis.io/commands/zrange
 */
export class ZRangeCommand<TData extends unknown[]> extends Command<
  string[],
  TData
> {
  constructor(
    cmd: [key: string, min: number, max: number, opts?: ZRangeCommandOptions],
    cmdOpts?: CommandOptions<string[], TData>,
  );
  constructor(
    cmd: [
      key: string,
      min: `(${string}` | `[${string}` | "-" | "+",
      max: `(${string}` | `[${string}` | "-" | "+",
      opts: { byLex: true } & ZRangeCommandOptions,
    ],
    cmdOpts?: CommandOptions<string[], TData>,
  );
  constructor(
    cmd: [
      key: string,
      min: number | `(${number}` | "-inf" | "+inf",
      max: number | `(${number}` | "-inf" | "+inf",
      opts: { byScore: true } & ZRangeCommandOptions,
    ],
    cmdOpts?: CommandOptions<string[], TData>,
  );
  constructor(
    [key, min, max, opts]: [
      key: string,
      min: number | string,
      max: number | string,
      opts?: ZRangeCommandOptions,
    ],
    cmdOpts?: CommandOptions<string[], TData>,
  ) {
    const command: unknown[] = ["zrange", key, min, max];

    // Either byScore or byLex is allowed
    if (opts?.byScore) {
      command.push("byscore");
    }
    if (opts?.byLex) {
      command.push("bylex");
    }
    if (opts?.rev) {
      command.push("rev");
    }
    if (
      typeof opts?.count !== "undefined" && typeof opts?.offset !== "undefined"
    ) {
      command.push("limit", opts!.offset, opts!.count);
    }
    if (opts?.withScores) {
      command.push("withscores");
    }
    super(command, cmdOpts);
  }
}
