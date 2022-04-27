import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/incr
 */
export class IncrCommand extends Command<number, number> {
  constructor(key: string) {
    super(["incr", key]);
  }
}
