import { Command } from "../command"
export type ZRangeCommandOptions = {
  withScores?: boolean
}

/**
 * @see https://redis.io/commands/zrange
 */
export class ZRangeCommand<TData extends unknown[]> extends Command<TData> {
  constructor(
    key: string,
    min: number | `(${number}`,
    max: number | `(${number}`,
    opts?: ZRangeCommandOptions,
  ) {
    const command: unknown[] = ["zrange", key, min, max]
    if (opts?.withScores) {
      command.push("withscores")
    }
    super(command)
  }
}
