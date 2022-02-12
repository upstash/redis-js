import { Command } from "../command"

/**
 * @see https://redis.io/commands/rename
 */
export class RenameCommand extends Command<string> {
  constructor(source: string, destination: string) {
    super(["reame", source, destination])
  }
}
