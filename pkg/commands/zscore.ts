import { Command } from "../command"

/**
 * @see https://redis.io/commands/zscore
 */
export class ZScoreCommand<TData = string> extends Command<number | null> {
  constructor(key: string, member: TData) {
    super(["zscore", key, member])
  }
}
