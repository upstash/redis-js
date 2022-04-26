import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/dbsize
 */
export class DBSizeCommand extends Command<number, number> {
  constructor() {
    super(["dbsize"]);
  }
}
