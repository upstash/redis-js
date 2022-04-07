import { Command } from "./command"

/**
 * @see https://redis.io/commands/expireat
 */
export class ExpireAtCommand extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string, unix: number]) {
    super(["expireat", ...cmd])
  }
}
