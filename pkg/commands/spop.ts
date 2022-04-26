import { Command } from "./command";
/**
 * @see https://redis.io/commands/spop
 */
export class SPopCommand<TData = number> extends Command<
  TData | null,
  string | null
> {
  constructor(key: string, count?: number) {
    const command: unknown[] = ["spop", key];
    if (typeof count === "number") {
      command.push(count);
    }
    super(command);
  }
}
