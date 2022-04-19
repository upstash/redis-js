import { Command } from "./command"

/**
 * @see https://redis.io/commands/eval
 */
export class EvalCommand<TArgs extends unknown[], TData> extends Command<unknown, TData> {
  constructor(script: string, nArgs: number, ...args: TArgs) {
    super(["eval", script, nArgs, ...args])
  }
}
