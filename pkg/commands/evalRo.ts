import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/eval_ro
 */
export class EvalROCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(
    [script, keys, args]: [script: string, keys: string[], args: TArgs],
    opts?: CommandOptions<unknown, TData>
  ) {
    super(["eval_ro", script, keys.length, ...keys, ...(args ?? [])], opts);
  }
}
