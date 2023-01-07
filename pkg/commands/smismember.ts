import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/smismember
 */
export class SMIsMemberCommand<TMembers extends unknown[]> extends Command<
  ("0" | "1")[],
  (0 | 1)[]
> {
  constructor(
    cmd: [key: string, members: TMembers],
    opts?: CommandOptions<("0" | "1")[], (0 | 1)[]>,
  ) {
    super(["smismember", cmd[0], ...cmd[1]], opts);
  }
}
