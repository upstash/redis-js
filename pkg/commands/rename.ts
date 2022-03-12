import { Command } from "./command"

/**
 * @see https://redis.io/commands/rename
 */
export class RenameCommand extends Command<"OK", "OK"> {
  constructor(source: string, destination: string) {
    super(["rename", source, destination])
  }
}
