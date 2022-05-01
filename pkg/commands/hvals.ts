import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/hvals
 */
export class HValsCommand<TData extends unknown[]> extends Command<
  unknown[],
  TData
> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown[], TData>) {
    super(["hvals", ...cmd], opts);
  }
}
