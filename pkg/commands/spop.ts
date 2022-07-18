import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/spop
 */
export class SPopCommand<TData> extends Command<
  string | string[] | null,
  TData | null
> {
  constructor(
    [key, count]: [key: string, count?: number],
    opts?: CommandOptions<string | string[] | null, TData | null>,
  ) {
    const command: unknown[] = ["spop", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
}
