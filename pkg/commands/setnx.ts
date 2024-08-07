import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/setnx
 */
export class SetNxCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, value: TData], opts?: CommandOptions<number, number>) {
    super(["setnx", ...cmd], opts);
  }
}
