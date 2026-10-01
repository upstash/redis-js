import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/commands/rename
 * @see node_modules/@upstash/redis/docs/commands/generic/rename.mdx
 */
export class RenameCommand extends Command<"OK", "OK"> {
  constructor(cmd: [source: string, destination: string], opts?: CommandOptions<"OK", "OK">) {
    super(["rename", ...cmd], opts);
  }
}
