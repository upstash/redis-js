import { Command } from "../command"

/**
 * @see https://redis.io/commands/pexpireat
 */
export class PExpireAtCommand extends Command<0 | 1> {
  constructor(key: string, unix: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["pexpireat", key, unix]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}
