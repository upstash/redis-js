import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/xdel
 */
export class XDelCommand extends Command<number, number> {
  constructor(
    [key, ids]: [key: string, ids: string[] | string],
    opts?: CommandOptions<number, number>,
  ) {
    const cmds = Array.isArray(ids) ? [...ids] : [ids];
    super(["XDEL", key, ...cmds], opts);
  }
}
