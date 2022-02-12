import { Command } from "../command"

/**
 * @see https://redis.io/commands/blpop
 */
export class BLPopCommand extends Command<number> {
  constructor(key: string, timeout: number)
  constructor(keys: string[], timeout: number)
  constructor(arg: string | string[], timeout: number) {
    const command: unknown[] = ["blpop"]
    if (typeof arg === "string") {
      command.push(arg)
    } else {
      command.push(...arg)
    }

    command.push(timeout)

    super(command)
  }
}
