import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/eval
 */
export class EvalCommand<TArgs extends unknown[], TData> extends Command<
  unknown,
  TData
> {
  constructor(
    [script, keys, args]: [script: string, keys: string[], args: TArgs],
    opts?: CommandOptions<unknown, TData>,
  ) {
    super(["eval", script, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
