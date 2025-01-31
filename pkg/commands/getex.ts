import type { CommandOptions } from "./command";
import { Command } from "./command";

type GetExCommandOptions =
  | { ex: number; px?: never; exat?: never; pxat?: never; persist?: never }
  | { ex?: never; px: number; exat?: never; pxat?: never; persist?: never }
  | { ex?: never; px?: never; exat: number; pxat?: never; persist?: never }
  | { ex?: never; px?: never; exat?: never; pxat: number; persist?: never }
  | { ex?: never; px?: never; exat?: never; pxat?: never; persist: true }
  | { ex?: never; px?: never; exat?: never; pxat?: never; persist?: never };

/**
 * @see https://redis.io/commands/getex
 */
export class GetExCommand<TData = string> extends Command<unknown | null, TData | null> {
  constructor(
    [key, opts]: [key: string, opts?: GetExCommandOptions],
    cmdOpts?: CommandOptions<unknown | null, TData | null>
  ) {
    const command: unknown[] = ["getex", key];
    if (opts) {
      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("px", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("exat", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("pxat", opts.pxat);
      } else if ("persist" in opts && opts.persist) {
        command.push("persist");
      }
    }
    super(command, cmdOpts);
  }
}
