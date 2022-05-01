import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/persist
 */
export class PersistCommand extends Command<"0" | "1", 0 | 1> {
  constructor(cmd: [key: string], opts?: CommandOptions<"0" | "1", 0 | 1>) {
    super(["persist", ...cmd], opts);
  }
}
