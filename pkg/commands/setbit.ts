import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/setbit
 */

export class SetBitCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, offset: number, value: 0 | 1],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["setbit", ...cmd], opts);
  }
}
