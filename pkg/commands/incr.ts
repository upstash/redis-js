import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/incr
 */
export class IncrCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["incr", ...cmd], opts);
  }
}
