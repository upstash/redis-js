import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/zincrby
 */
export class ZIncrByCommand<TData> extends Command<number, number> {
  constructor(
    cmd: [key: string, increment: number, member: TData],
    opts?: CommandOptions<number, number>,
  ) {
    super(["zincrby", ...cmd], opts);
  }
}
