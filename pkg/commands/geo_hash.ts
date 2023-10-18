import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/geohash
 */
export class GeoHashCommand<TData extends string[]>
  extends Command<(string | null)[], TData> {
  constructor(
    cmd: [string, ...string[]] | [string, string[]],
    opts?: CommandOptions<(string | null)[], TData>,
  ) {
    const [key] = cmd;
    // Check if the second argument is an array of strings (members).
    // If it is, use it directly; if not, it means the members were passed individually,
    // so we slice the cmd from the second element onwards to get the members.
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);

    super(["GEOHASH", key, ...members], opts);
  }
}
