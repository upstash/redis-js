import { Command } from "./command";

/**
 * @see https://redis.io/commands/pexpire
 */
export class PExpireCommand extends Command<0 | 1, "0" | "1"> {
  constructor(cmd: [key: string, milliseconds: number]) {
    super(["pexpire", ...cmd])
  }
}
