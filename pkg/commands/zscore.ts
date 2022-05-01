import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/zscore
 */
export class ZScoreCommand<TData> extends Command<
  string | null,
  number | null
> {
  constructor(
    cmd: [key: string, member: TData],
    opts?: CommandOptions<string | null, number | null>,
  ) {
    super(["zscore", ...cmd], opts);
  }
}
