import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/hexists
 */
export class HExistsCommand extends Command<number, number> {
  constructor(key: string, field: string) {
    super(["hexists", key, field]);
  }
}
