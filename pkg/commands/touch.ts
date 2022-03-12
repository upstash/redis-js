import { Command } from "./command"

/**
 * @see https://redis.io/commands/touch
 */
export class TouchCommand extends Command<number, number> {
  constructor(...keys: string[]) {
    super(["touch", ...keys])
  }
}
