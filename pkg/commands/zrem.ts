import type { CommandOptions } from "./command";
import { Command } from "./command";
/**
 * @see https://redis.io/commands/zrem
 */
export class ZRemCommand<TData = string> extends Command<number, number> {
  constructor(cmd: [key: string, ...members: TData[]], opts?: CommandOptions<number, number>) {
    super(["zrem", ...cmd], opts);
  }
}
