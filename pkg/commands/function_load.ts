import type { CommandOptions } from "./command";
import { Command } from "./command";

/**
 * @see https://redis.io/docs/latest/commands/function-load/
 */
export class FunctionLoadCommand extends Command<string, string> {
  constructor(
    [args]: [{ code: string; replace?: boolean }],
    opts?: CommandOptions<string, string>
  ) {
    super(["function", "load", ...(args.replace ? ["replace"] : []), args.code], opts);
  }
}
