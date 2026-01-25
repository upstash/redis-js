import type { CommandOptions } from "./command";
import { Command } from "./command";

export type ClientSetInfoAttribute = "LIB-NAME" | "lib-name" | "LIB-VER" | "lib-ver";

/**
 * @see https://redis.io/commands/client-setinfo
 */
export class ClientSetInfoCommand extends Command<string, string> {
  constructor(
    [attribute, value]: [attribute: ClientSetInfoAttribute, value: string],
    opts?: CommandOptions<string, string>
  ) {
    super(["CLIENT", "SETINFO", attribute.toUpperCase(), value], opts);
  }
}
