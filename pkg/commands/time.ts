import { Command } from "./command";
/**
 * @see https://redis.io/commands/time
 */
export class TimeCommand extends Command<[number, number], [number, number]> {
  constructor() {
    super(["time"]);
  }
}
