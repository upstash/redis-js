import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/srandmember
 */
export class SRandMemberCommand<TData> extends Command<
  string | null,
  TData | null
> {
  constructor(
    [key, count]: [key: string, count?: number],
    opts?: CommandOptions<string | null, TData | null>,
  ) {
    const command: unknown[] = ["srandmember", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
}
