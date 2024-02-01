import { Command, CommandOptions } from "./command";

export const UNBALANCED_XREAD_ERR =
  "ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified";

type XReadCommandOptions = [
  key: string | string[],
  id: string | string[],
  options?: { count?: number; blockMS?: number },
];

//This type ensures users have balanced stream keys and stream ids otherwise redis server will throw an error.
type XReadOptions = XReadCommandOptions extends [infer K, infer I, ...any[]]
  ? K extends string
    ? I extends string
      ? [key: string, id: string, options?: { count?: number; blockMS?: number }]
      : never
    : K extends string[]
    ? I extends string[]
      ? [key: string[], id: string[], options?: { count?: number; blockMS?: number }]
      : never
    : never
  : never;

/**
 * @see https://redis.io/commands/xread
 */
export class XReadCommand extends Command<number, unknown[]> {
  constructor([key, id, options]: XReadOptions, opts?: CommandOptions<number, unknown[]>) {
    if (Array.isArray(key) && Array.isArray(id)) {
      if (key.length !== id.length) {
        throw new Error(UNBALANCED_XREAD_ERR);
      }
    }
    const commands: unknown[] = [];

    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (typeof options?.blockMS === "number") {
      commands.push("BLOCK", options.blockMS);
    }

    commands.push(
      "STREAMS",
      ...(Array.isArray(key) ? [...key] : [key]),
      ...(Array.isArray(id) ? [...id] : [id]),
    );

    super(["XREAD", ...commands], opts);
  }
}
