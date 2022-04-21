import { Command } from "./command";

/**
 * @see https://redis.io/commands/incr
 */
export class IncrCommand extends Command<number, number> {
  constructor(cmd: [key: string]) {
    super(["incr", ...cmd])
  }
}
