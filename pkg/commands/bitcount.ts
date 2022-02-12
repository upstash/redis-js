import { Command } from "../command"

/**
 * @see https://redis.io/commands/bitcount
 */
export class BitCountCommand extends Command<number> {
  constructor(key: string, start?: never, end?: never)
  constructor(key: string, start: number, end: number)
  constructor(key: string, start?: number, end?: number) {
    const command: unknown[] = ["bitcount", key]
    if (typeof start === "number") {
      command.push(start)
    }
    if (typeof end === "number") {
      command.push(end)
    }
    super(command)
  }
}
