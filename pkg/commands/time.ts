import { Command } from "./command.ts";
/**
 * @see https://redis.io/commands/time
 */
export class TimeCommand extends Command<[number, number], [number, number]> {
  constructor() {
    super(["time"]);
  }
}
