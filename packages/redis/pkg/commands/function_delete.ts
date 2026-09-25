import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/function-delete/
 * @see node_modules/@upstash/redis/docs/commands/functions/delete.mdx
 */
export class FunctionDeleteCommand extends Command<"OK", "OK"> {
  constructor([libraryName]: [libraryName: string], opts?: CommandOptions<"OK", "OK">) {
    super(["function", "delete", libraryName], opts);
  }
}
