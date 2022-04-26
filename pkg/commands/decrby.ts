import { Command } from "./command";

/**
 * @see https://redis.io/commands/decrby
 */
export class DecrByCommand extends Command<number, number> {
  constructor(key: string, decrement: number) {
    super(["decrby", key, decrement]);
  }
}
