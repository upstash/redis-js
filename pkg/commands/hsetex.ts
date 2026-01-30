import type { CommandOptions } from "./command";
import { Command } from "./command";

type HSetExConditionalOptions = "FNX" | "fnx" | "FXX" | "fxx";

type HSetExExpirationOptions =
  | { ex: number; px?: never; exat?: never; pxat?: never; keepttl?: never }
  | { ex?: never; px: number; exat?: never; pxat?: never; keepttl?: never }
  | { ex?: never; px?: never; exat: number; pxat?: never; keepttl?: never }
  | { ex?: never; px?: never; exat?: never; pxat: number; keepttl?: never }
  | { ex?: never; px?: never; exat?: never; pxat?: never; keepttl: true }
  | { ex?: never; px?: never; exat?: never; pxat?: never; keepttl?: never };

type HSetExCommandOptions = {
  conditional?: HSetExConditionalOptions;
  expiration?: HSetExExpirationOptions;
};

/**
 * HSETEX sets the specified fields with their values and optionally sets their expiration time or TTL
 * Returns 1 on success and 0 otherwise.
 *
 * @see https://redis.io/commands/hsetex
 */
export class HSetExCommand<TData> extends Command<number, number> {
  constructor(
    [key, opts, kv]: [
      key: string,
      opts: HSetExCommandOptions,
      kv: Record<string, TData>,
    ],
    cmdOpts?: CommandOptions<number, number>
  ) {
    const command: (string | number | TData)[] = ["hsetex", key];

    if (opts.conditional) {
      command.push(opts.conditional.toUpperCase());
    }

    if (opts.expiration) {
      if ("ex" in opts.expiration && typeof opts.expiration.ex === "number") {
        command.push("EX", opts.expiration.ex);
      } else if ("px" in opts.expiration && typeof opts.expiration.px === "number") {
        command.push("PX", opts.expiration.px);
      } else if ("exat" in opts.expiration && typeof opts.expiration.exat === "number") {
        command.push("EXAT", opts.expiration.exat);
      } else if ("pxat" in opts.expiration && typeof opts.expiration.pxat === "number") {
        command.push("PXAT", opts.expiration.pxat);
      } else if ("keepttl" in opts.expiration && opts.expiration.keepttl) {
        command.push("KEEPTTL");
      }
    }

    const entries = Object.entries(kv);
    command.push("FIELDS", entries.length);
    for (const [field, value] of entries) {
      command.push(field, value);
    }

    super(command, cmdOpts);
  }
}
