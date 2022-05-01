import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/getbit
 */
export class GetBitCommand extends Command<"0" | "1", 0 | 1> {
  constructor(
    cmd: [key: string, offset: number],
    opts?: CommandOptions<"0" | "1", 0 | 1>,
  ) {
    super(["getbit", ...cmd], opts);
  }
}
