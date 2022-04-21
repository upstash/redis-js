import { Command } from "./command";

/**
 * @see https://redis.io/commands/setrange
 */
export class SetRangeCommand extends Command<number, number> {
  constructor(cmd: [key: string, offset: number, value: string]) {
    super(["setrange", ...cmd])
  }
}
