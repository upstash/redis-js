import { Command, CommandOptions } from "./command";

/**
 * @see https://redis.io/commands/rename
 */
export class RenameCommand extends Command<"OK", "OK"> {
  constructor(cmd: [source: string, destination: string], opts?: CommandOptions<"OK", "OK">) {
    super(["rename", ...cmd], opts);
  }
}
