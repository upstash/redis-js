import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/getbit
 */
export class GetBitCommand extends Command<0 | 1, "0" | "1"> {
  constructor(key: string, offset: number) {
    super(["getbit", key, offset]);
  }
}
