import { Command } from "./command";
/**
 * @see https://redis.io/commands/scard
 */
export class SCardCommand extends Command<number, number> {
  constructor(key: string) {
    super(["scard", key]);
  }
}
