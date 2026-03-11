import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/lpushx
 */
export class LPushXCommand<TData> extends Command<number, number> {
  constructor(cmd: [key: string, ...elements: TData[]], opts?: CommandOptions<number, number>) {
    super(["lpushx", ...cmd], opts);
  }
}
