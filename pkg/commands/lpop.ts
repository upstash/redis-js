import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/lpop
 */
export class LPopCommand<TData = string> extends Command<
  TData | null,
  unknown | null
> {
  constructor(key: string) {
    super(["lpop", key]);
  }
}
