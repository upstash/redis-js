import { Command } from "./command";
/**
 * @see https://redis.io/commands/zcount
 */
export class ZCountCommand extends Command<number, number> {
  constructor(cmd: [key: string, min: number | string, max: number | string]) {
    super(["zcount", ...cmd])
  }
}
