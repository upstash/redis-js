import { Command } from "../command"

/**
 * @see https://redis.io/commands/brpop
 */
export class BRPopCommand extends Command<number> {
  constructor(key: string, timeout: number)
  constructor(keys: string[], timeout: number)
  constructor(arg: string | string[], timeout: number) {
    const command: unknown[] = ["brpop"]
    if (typeof arg === "string") {
      command.push(arg)
    } else {
      command.push(...arg)
    }

    command.push(timeout)

    super(command)
  }
}
