import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/srem
 */
export class SRemCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...members: TData[]], opts?: CommandOptions<number, number>) {
    super(["srem", ...cmd], opts);
  }
}
