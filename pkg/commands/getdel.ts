import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/getdel
 */
export class GetDelCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown | null, TData | null>) {
    super(["getdel", ...cmd], opts);
  }
}
