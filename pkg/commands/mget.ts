import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/mget
 */
export class MGetCommand<TData extends unknown[]>
  extends Command<(string | null)[], TData> {
  constructor(
    cmd: [string[]] | [...string[] | string[]],
    opts?: CommandOptions<(string | null)[], TData>,
  ) {
    const keys = Array.isArray(cmd[0])
      ? (cmd[0] as string[])
      : (cmd as string[]);
    super(["mget", ...keys], opts);
  }
}
