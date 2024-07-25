import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/get
 */
export class GetCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(cmd: [key: string], opts?: CommandOptions<unknown | null, TData | null>) {
    super(["get", ...cmd], opts);
  }
}
