import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/zscore
 */
export class ZScoreCommand<TData>
  extends Command<number | null, string | null> {
  constructor(key: string, member: TData) {
    super(["zscore", key, member]);
  }
}
