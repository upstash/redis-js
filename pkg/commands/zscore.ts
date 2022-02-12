import { Command } from "../command"

/**
 * @see https://redis.io/commands/zscore
 */
export class ZScoreCommand<TValue = string> extends Command<number | null> {
  constructor(key: string, member: TValue) {
    super(["zscore", key, member])
  }
}
