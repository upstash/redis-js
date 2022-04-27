import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/expire
 */
export class ExpireCommand extends Command<0 | 1, "0" | "1"> {
  constructor(key: string, seconds: number) {
    super(["expire", key, seconds]);
  }
}
