import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/renamenx
 */
export class RenameNXCommand extends Command<"0" | "1", 0 | 1> {
  constructor(cmd: [source: string, destination: string], opts?: CommandOptions<"0" | "1", 0 | 1>) {
    super(["renamenx", ...cmd], opts);
  }
}
