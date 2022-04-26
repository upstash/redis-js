import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/pexpire
 */
export class PExpireCommand extends Command<0 | 1, "0" | "1"> {
  constructor(key: string, milliseconds: number) {
    super(["pexpire", key, milliseconds]);
  }
}
