import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/function-flush/
 */
export class FunctionFlushCommand extends Command<"OK", "OK"> {
  constructor([args]: [args?: { mode?: "ASYNC" | "SYNC" }], opts?: CommandOptions<"OK", "OK">) {
    super(["function", "flush", ...(args?.mode ? [args.mode] : [])], opts);
  }
}
