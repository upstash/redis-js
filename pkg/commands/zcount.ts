import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/zcount
 */
export class ZCountCommand extends Command<number, number> {
  constructor(
    cmd: [key: string, min: number | string, max: number | string],
    opts?: CommandOptions<number, number>,
  ) {
    super(["zcount", ...cmd], opts);
  }
}
