import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/zpopmax
 */
export class ZPopMaxCommand<TData> extends Command<string[], TData[]> {
  constructor(
    [key, count]: [key: string, count?: number],
    opts?: CommandOptions<string[], TData[]>,
  ) {
    const command: unknown[] = ["zpopmax", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command, opts);
  }
}
