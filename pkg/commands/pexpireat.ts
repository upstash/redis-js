import { Command } from "./command"

/**
 * @see https://redis.io/commands/pexpireat
 */
export class PExpireAtCommand extends Command<0 | 1, "0" | "1"> {
  constructor(key: string, unix: number) {
    super(["pexpireat", key, unix])
  }
}
