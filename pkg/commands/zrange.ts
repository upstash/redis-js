import { Command } from "./command"

export type ZRangeCommandOptions = {
  withScores?: boolean
} & (
  | { byScore: true; byLex?: never }
  | { byScore?: never; byLex: true }
  | { byScore?: never; byLex?: never }
)

/**
 * @see https://redis.io/commands/zrange
 */
export class ZRangeCommand<TData extends unknown[]> extends Command<TData, string[]> {
  constructor(cmd: [key: string, min: number, max: number, opts?: ZRangeCommandOptions])
  constructor(
    cmd: [
      key: string,
      min: `(${string}` | `[${string}` | "-" | "+",
      max: `(${string}` | `[${string}` | "-" | "+",
      opts: { byLex: true } & ZRangeCommandOptions,
    ],
  )
  constructor(
    cmd: [
      key: string,
      min: number | `(${number}` | "-inf" | "+inf",
      max: number | `(${number}` | "-inf" | "+inf",
      opts: { byScore: true } & ZRangeCommandOptions,
    ],
  )
  constructor([key, min, max, opts]: [
    key: string,
    min: number | string,
    max: number | string,
    opts?: ZRangeCommandOptions,
  ]) {
    const command: unknown[] = ["zrange", key, min, max]

    // Either byScore or byLex is allowed
    if (opts?.byScore) {
      command.push("byscore")
    }
    if (opts?.byLex) {
      command.push("bylex")
    }
    if (opts?.withScores) {
      command.push("withscores")
    }
    super(command)
  }
}
