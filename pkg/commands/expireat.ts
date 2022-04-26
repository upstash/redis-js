import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/expireat
 */
export class ExpireAtCommand extends Command<0 | 1, "0" | "1"> {
  constructor(key: string, unix: number) {
    super(["expireat", key, unix]);
  }
}
