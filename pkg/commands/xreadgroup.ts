import { Command, CommandOptions } from "./command";

export const UNBALANCED_XREADGROUP_ERR =
  "ERR Unbalanced XREADGROUP list of streams: for each stream key an ID or '$' must be specified";

type Options = { count?: number; blockMS?: number; NOACK?: boolean };
type XReadGroupCommandOptions = [
  group: string,
  consumer: string,
  key: string | string[],
  id: string | string[],
  options?: Options,
];

//This type ensures users have balanced stream keys and stream ids otherwise redis server will throw an error.
type XReadGroupOptions = XReadGroupCommandOptions extends [
  string,
  string,
  infer TKey,
  infer TId,
  ...any[],
]
  ? TKey extends string
    ? TId extends string
      ? [group: string, consumer: string, key: string, id: string, options?: Options]
      : never
    : TKey extends string[]
    ? TId extends string[]
      ? [group: string, consumer: string, key: string[], id: string[], options?: Options]
      : never
    : never
  : never;

/**
 * @see https://redis.io/commands/xreadgroup
 */
export class XReadGroupCommand extends Command<number, unknown[]> {
  constructor(
    [group, consumer, key, id, options]: XReadGroupOptions,
    opts?: CommandOptions<number, unknown[]>,
  ) {
    if (Array.isArray(key) && Array.isArray(id)) {
      if (key.length !== id.length) {
        throw new Error(UNBALANCED_XREADGROUP_ERR);
      }
    }
    const commands: unknown[] = [];

    if (typeof options?.count === "number") {
      commands.push("COUNT", options.count);
    }
    if (typeof options?.blockMS === "number") {
      commands.push("BLOCK", options.blockMS);
    }
    if (typeof options?.NOACK === "boolean" && options?.NOACK) {
      commands.push("NOACK");
    }

    commands.push(
      "STREAMS",
      ...(Array.isArray(key) ? [...key] : [key]),
      ...(Array.isArray(id) ? [...id] : [id]),
    );

    super(["XREADGROUP", "GROUP", group, consumer, ...commands], opts);
  }
}
