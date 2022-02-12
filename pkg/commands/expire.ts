import { Command } from "../command"

/**
 * @see https://redis.io/commands/expire
 */
export class ExpireCommand extends Command<0 | 1> {
  constructor(key: string, seconds: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["expire", key, seconds]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}
