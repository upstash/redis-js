import { Command } from "./command";

/**
 * @see https://redis.io/commands/zcard
 */
export class ZCardCommand extends Command<number, number> {
  constructor(cmd: [key: string]) {
    super(["zcard", ...cmd])
  }
}
