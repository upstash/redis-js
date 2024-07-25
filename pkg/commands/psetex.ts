import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/psetex
 */
export class PSetEXCommand<TData = string> extends Command<string, string> {
  constructor(
    cmd: [key: string, ttl: number, value: TData],
    opts?: CommandOptions<string, string>
  ) {
    super(["psetex", ...cmd], opts);
  }
}
