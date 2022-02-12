import { Command } from "../command"

/**
 * @see https://redis.io/commands/pexpire
 */
export class PExpireCommand extends Command<0 | 1> {
  constructor(key: string, milliseconds: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["pexpire", key, milliseconds]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}
