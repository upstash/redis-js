import { Command, CommandOptions } from "./command.ts";

type TupleOfLength<
  T,
  L extends number,
  R extends T[] = [],
> = R["length"] extends L ? R : TupleOfLength<T, L, [...R, T]>;

/**
 * @see https://redis.io/commands/script-exists
 */
export class ScriptExistsCommand<
  T extends [string, ...string[]],
> extends Command<
  T extends [string] ? string : TupleOfLength<string, T["length"]>,
  TupleOfLength<string, T["length"]>
> {
  constructor(
    hashes: T,
    opts?: CommandOptions<
      T extends [string] ? string : TupleOfLength<string, T["length"]>,
      TupleOfLength<string, T["length"]>
    >,
  ) {
    super(["script", "exists", ...hashes], {
      deserialize: (result) => {
        /**
         * This isn't very pretty but it does the job.
         * The user facing api is clean and will return a single `string` if they provided
         * a single script hash, and an array of strings of the same length when given an
         * array of hashes.
         */
        const parsed = result as string[];
        return parsed.length === 1 ? (parsed[0] as any) : parsed;
      },
      ...opts,
    });
  }
}
