import { Command } from "../command"

/**
 * @see https://redis.io/commands/expireat
 */
export class ExpireAtCommand extends Command<0 | 1> {
  constructor(key: string, unix: number, opts?: "nx" | "xx" | "gt" | "lt") {
    const command = ["expireat", key, unix]
    if (opts) {
      command.push(opts)
    }
    super(command)
  }
}
