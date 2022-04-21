import { Command } from "./command";

/**
 * @see https://redis.io/commands/zscore
 */
export class ZScoreCommand<TData> extends Command<number | null, string | null> {
  constructor(cmd: [key: string, member: TData]) {
    super(["zscore", ...cmd])
  }
}
