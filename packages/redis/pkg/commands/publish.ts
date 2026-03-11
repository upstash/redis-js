import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/publish
 */
export class PublishCommand<TMessage = unknown> extends Command<number, number> {
  constructor(cmd: [channel: string, message: TMessage], opts?: CommandOptions<number, number>) {
    super(["publish", ...cmd], opts);
  }
}
