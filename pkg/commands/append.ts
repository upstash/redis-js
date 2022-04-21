import { Command } from "./command";

/**
 * @see https://redis.io/commands/append
 */
export class AppendCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: string]) {
    super(["append", ...cmd])
  }
}
