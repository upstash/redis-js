import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/hlen
 */
export class HLenCommand extends Command<number, number> {
  constructor(key: string) {
    super(["hlen", key]);
  }
}
