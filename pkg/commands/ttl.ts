import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/ttl
 */
export class TtlCommand extends Command<number, number> {
  constructor(cmd: [key: string], opts?: CommandOptions<number, number>) {
    super(["ttl", ...cmd], opts);
  }
}
