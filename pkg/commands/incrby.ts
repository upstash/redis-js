import { Command } from "./command";

/**
 * @see https://redis.io/commands/incrby
 */
export class IncrByCommand extends Command<number, number> {
  constructor(cmd: [key: string, value: number]) {
    super(["incrby", ...cmd])
  }
}
