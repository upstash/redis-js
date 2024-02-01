import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xack
 */
export class XAckCommand extends Command<number, number> {
  constructor(
    [key, group, id]: [key: string, group: string, id: string | string[]],
    opts?: CommandOptions<number, number>,
  ) {
    const ids = Array.isArray(id) ? [...id] : [id];
    super(["XACK", key, group, ...ids], opts);
  }
}
