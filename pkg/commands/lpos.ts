import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/lpos
 */
export class LPosCommand<TData = number> extends Command<
  TData,
  TData
> {
  constructor(
    cmd: [
      key: string,
      element: unknown,
      opts?: { rank?: number; count?: number; maxLen?: number },
    ],
    opts?: CommandOptions<TData, TData>,
  ) {
    const args = ["lpos", cmd[0], cmd[1]];

    if (typeof cmd[2]?.rank === "number") {
      args.push("rank", cmd[2].rank);
    }
    if (typeof cmd[2]?.count === "number") {
      args.push("count", cmd[2].count);
    }
    if (typeof cmd[2]?.maxLen === "number") {
      args.push("maxLen", cmd[2].maxLen);
    }
    super(args, opts);
  }
}
