import { Command } from "../command"

/**
 * @see https://redis.io/commands/renamenx
 */
export class RenameNXCommand extends Command<0 | 1, "0" | "1"> {
  constructor(source: string, destination: string) {
    super(["renamenx", source, destination])
  }
}
