import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/evalsha
 */
export class EvalshaCommand<TArgs extends unknown[], TData> extends Command<
  unknown,
  TData
> {
  constructor(sha: string, keys: string[], args?: TArgs) {
    super(["evalsha", sha, keys.length, ...keys, ...(args ?? [])]);
  }
}
