import type { CommandOptions } from "./command";
import { Command } from "./command";

export type FunctionLoadArgs = {
  /**
   * The Lua code to load.
   *
   * Example:
   * ```lua
   * #!lua name=mylib
   * redis.register_function('myfunc', function() return 'ok' end)
   * ```
   */
  code: string;
  /**
   * If true, the library will replace the existing library with the same name.
   *
   * @default false
   */
  replace?: boolean;
};

/**
 * @see https://redis.io/docs/latest/commands/function-load/
 */
export class FunctionLoadCommand extends Command<string, string> {
  constructor([args]: [args: FunctionLoadArgs], opts?: CommandOptions<string, string>) {
    super(["function", "load", ...(args.replace ? ["replace"] : []), args.code], opts);
  }
}
