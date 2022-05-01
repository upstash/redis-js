import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/evalsha
 */
export class EvalshaCommand<TArgs extends unknown[], TData> extends Command<
  unknown,
  TData
> {
  constructor(
    [sha, keys, args]: [sha: string, keys: string[], args?: TArgs],
    opts?: CommandOptions<unknown, TData>,
  ) {
    super(["evalsha", sha, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
