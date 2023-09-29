import { Command, CommandOptions } from "./command.ts";

export type SetCommandOptions =
  & { get?: boolean }
  & (
    | { ex: number; px?: never; exat?: never; pxat?: never; keepTtl?: never }
    | { ex?: never; px: number; exat?: never; pxat?: never; keepTtl?: never }
    | { ex?: never; px?: never; exat: number; pxat?: never; keepTtl?: never }
    | { ex?: never; px?: never; exat?: never; pxat: number; keepTtl?: never }
    | { ex?: never; px?: never; exat?: never; pxat?: never; keepTtl: true }
    | { ex?: never; px?: never; exat?: never; pxat?: never; keepTtl?: never }
  )
  & (
    | { nx: true; xx?: never }
    | { xx: true; nx?: never }
    | { xx?: never; nx?: never }
  );

/**
 * @see https://redis.io/commands/set
 */
export class SetCommand<TData, TResult = TData | "OK" | null>
  extends Command<TResult, TData | "OK" | null> {
  constructor(
    [key, value, opts]: [key: string, value: TData, opts?: SetCommandOptions],
    cmdOpts?: CommandOptions<TResult, TData>,
  ) {
    const command: unknown[] = ["set", key, value];
    if (opts) {
      if ("nx" in opts && opts.nx) {
        command.push("nx");
      } else if ("xx" in opts && opts.xx) {
        command.push("xx");
      }

      if ("get" in opts && opts.get) {
        command.push("get");
      }

      if ("ex" in opts && typeof opts.ex === "number") {
        command.push("ex", opts.ex);
      } else if ("px" in opts && typeof opts.px === "number") {
        command.push("px", opts.px);
      } else if ("exat" in opts && typeof opts.exat === "number") {
        command.push("exat", opts.exat);
      } else if ("pxat" in opts && typeof opts.pxat === "number") {
        command.push("pxat", opts.pxat);
      } else if ("keepTtl" in opts && opts.keepTtl) {
        command.push("keepTtl");
      }
    }
    super(command, cmdOpts);
  }
}
