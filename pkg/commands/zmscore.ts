import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/zmscore
 */
export class ZMScoreCommand<TData> extends Command<
  string[] | null,
  number[] | null
> {
  constructor(
    cmd: [key: string, members: TData[]],
    opts?: CommandOptions<string[] | null, number[] | null>,
  ) {
    const [key, members] = cmd;
    super(["zmscore", key, ...members], opts);
  }
}
