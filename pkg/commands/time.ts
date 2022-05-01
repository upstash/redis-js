import { Command, CommandOptions } from "./command.ts";
/**
 * @see https://redis.io/commands/time
 */
export class TimeCommand extends Command<[number, number], [number, number]> {
  constructor(opts?: CommandOptions<[number, number], [number, number]>) {
    super(["time"], opts);
  }
}
