import { Command } from "./command";

/**
 * @see https://redis.io/commands/hdel
 */
export class HDelCommand extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string, field: string]) {
    super(["hdel", ...cmd])
  }
}
