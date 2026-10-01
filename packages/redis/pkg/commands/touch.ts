import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/touch
 * @see node_modules/@upstash/redis/docs/commands/generic/touch.mdx
 */
export class TouchCommand extends Command<number, number> {
  constructor(cmd: [...keys: string[]], opts?: CommandOptions<number, number>) {
    super(["touch", ...cmd], opts);
  }
}
