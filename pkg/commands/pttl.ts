import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/pttl
 */
export class PTtlCommand extends Command<number, number> {
  constructor(key: string) {
    super(["pttl", key]);
  }
}
