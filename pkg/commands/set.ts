import { Command } from "./command";

export type SetCommandOptions =
  & (
    | { ex: number; px?: never }
    | { ex?: never; px: number }
    | { ex?: never; px?: never }
  )
  & (
    | { nx: true; xx?: never }
    | { xx: true; nx?: never }
    | { xx?: never; nx?: never }
  );

/**
 * @see https://redis.io/commands/set
 */
export class SetCommand<TData, TResult = "OK"> extends Command<TData, TResult> {
  constructor(key: string, value: TData, opts?: SetCommandOptions) {
    const command: unknown[] = ["set", key, value];
    if (opts) {
      if (("ex" in opts) && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if (("px" in opts) && typeof opts.px === "number") {
        command.push("px", opts.px);
      }

      if (("nx" in opts) && opts.nx) {
        command.push("nx");
      } else if (("xx" in opts) && opts.xx) {
        command.push("xx");
      }
    }
    super(command);
  }
}
