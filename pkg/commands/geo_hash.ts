import { Command, CommandOptions } from "./command.ts";

/**
 * @see https://redis.io/commands/geohash
 */
export class GeoHashCommand<TMember = string>
  extends Command<(string | null)[], (string | null)[]> {
  constructor(
    cmd: [string, ...TMember[] | TMember[]],
    opts?: CommandOptions<(string | null)[], (string | null)[]>,
  ) {
    const [key] = cmd;
    // Check if the second argument is an array of strings (members).
    // If it is, use it directly; if not, it means the members were passed individually,
    // so we slice the cmd from the second element onwards to get the members.
    const members = Array.isArray(cmd[1]) ? cmd[1] : cmd.slice(1);

    super(["GEOHASH", key, ...members], opts);
  }
}
