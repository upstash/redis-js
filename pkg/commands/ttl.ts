import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/ttl
 */
export class TtlCommand extends Command<number, number> {
  constructor(key: string) {
    super(["ttl", key]);
  }
}
