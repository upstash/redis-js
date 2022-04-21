import { Command } from "./command";

/**
 * @see https://redis.io/commands/getbit
 */
export class GetBitCommand extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string, offset: number]) {
    super(["getbit", ...cmd])
  }
}
