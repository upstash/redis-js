import { Command } from "./command";
/**
 * @see https://redis.io/commands/scard
 */
export class SCardCommand extends Command<number, number> {
  constructor(cmd: [key: string]) {
    super(["scard", ...cmd])
  }
}
