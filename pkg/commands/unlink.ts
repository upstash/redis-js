import { Command } from "./command.ts";

/**
 * @see https://redis.io/commands/unlink
 */
export class UnlinkCommand extends Command<number, number> {
  constructor(...keys: string[]) {
    super(["unlink", ...keys]);
  }
}
